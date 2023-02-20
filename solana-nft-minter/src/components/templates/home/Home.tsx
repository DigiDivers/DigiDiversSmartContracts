import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem } from '@chakra-ui/react';

const Home = () => {
  return (
    <VStack w={'full'}>
      <Heading>
        Mint NFT in order to play Digi Divers
      </Heading>
        <a style={{ marginTop: "50px"}} href='./nftMinter'><u>Mint Digi Diver NFT</u></a>
    </VStack>
  );
};

export default Home;
