/* eslint-disable no-undef */
import {
  FormControl,
  FormLabel,
  useColorModeValue,
  Input,
  SimpleGrid,
  Box,
  Flex,
  Image,
  Textarea,
  Button,
  Heading,
  useToast,
  FormHelperText,
} from '@chakra-ui/react';
import { FC, useState, ChangeEvent } from 'react';
import { toMetaplexFileFromBrowser, UploadMetadataOutput } from '@metaplex-foundation/js';

import { Metaplex, bundlrStorage, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import apiPost from 'utils/apiPost';
import backgroundImg from "./img.png";

const NFTMinter: FC = () => {
  const BgColor = useColorModeValue('gray.100', 'gray.600');
  const [file, setFile] = useState<FileList>();
  const [imageUrl, setImageUrl] = useState('https://www.maycocolors.com/wp-content/uploads/2020/09/ss-141.jpg');
  const [name, setName] = useState('Digi Divers Avatar Collection #1');
  const [description, setDescription] = useState('First Collection --Digi Divers');
  const [status, SetStatus] = useState('');
  const toast = useToast();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // TODO: Setup Metaplex and wallet provider
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl('devnet'));
  const metaplex = new Metaplex(connection);

  const mintNFT = async () => {
    metaplex.use(walletAdapterIdentity(wallet));
    metaplex.use(
      bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }),
    );

    // TODO: Upload to Arweave
    SetStatus('Uploading Metadata');
    const convertBase64 = (inputFile: any) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(inputFile);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };
    console.log(`file: ${file}`);
    
    if (file) {
      const base64Data = await convertBase64(file[0]);
      const options = {
        name,
        description,
        image: base64Data,
        symbol: 'M-NFT',
      };

      const uri = await apiPost('/upload', options)
        .then((data: UploadMetadataOutput) => {
          console.log(data);
          return data.uri;
        })
        .catch((e) => {
          console.log(e);
        });


      if (!uri) {
        SetStatus('');
        throw toast({
          title: 'Upload Failed',
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        });
      }
      // TODO: Processing Mint
      SetStatus('Processing Mint');
      const data = await metaplex
        .nfts()
        .create({
          uri,
          name,
          sellerFeeBasisPoints: 500,
        })
        .run()
        .catch((e) => {
          SetStatus('');
          throw toast({
            title: 'Mint Failed',
            description: `Error: ${e.message}`,
            status: 'error',
            position: 'bottom-right',
            isClosable: true,
          });
        });
      console.log({ data });

      // TODO: Mint Successful Message
      SetStatus('');
      toast({
        title: 'Mint Successful',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    };
  };

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Digi Divers NFT Minter
      </Heading>
      <FormControl>
        <SimpleGrid
          h={450}
          columns={2}
          row={1}
          spacing={2}
          bgColor={BgColor}
          padding={4}
          borderRadius="xl"
          marginTop={2}
        >
          <Flex alignItems={'center'} justifyContent={'center'}>
            <Image
              src={`${imageUrl}`}
              fallbackSrc="https://via.placeholder.com/300/657287/FFFFFF?text=Select+Image+To+Mint"
              alt={'No Image'}
              objectFit="cover"
              boxSize="400"
            />
          </Flex>
          <Flex direction={'column'} alignItems={'stretch'} justifyContent={'space-around'}>
            <Box>
              <FormLabel fontWeight={"800"}>NFT Name</FormLabel>
              <FormLabel>{name}</FormLabel>
            </Box>
            <Box>
              <FormLabel fontWeight={"800"}>NFT Description</FormLabel>
              <FormLabel>{description}</FormLabel>
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={status ? true : false}
              onClick={() => {
                mintNFT().catch((e: Error) => {
                  return e.message;
                });
              }}
            >
              Mint
            </Button>
            <FormHelperText>{status && status}</FormHelperText>
          </Flex>
        </SimpleGrid>
      </FormControl>
    </>
  );
};

export default NFTMinter;
