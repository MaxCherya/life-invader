import { Box, Flex, VStack } from '@chakra-ui/react'
import Navbar from './navbar';

const Layout = ({ children }) => {
    return (
        <VStack w='100vw' minH='100vh' bg='#1a1a1a'>
            <Navbar />
            <Box w='100%'>
                {children}
            </Box>
        </VStack>
    )
}

export default Layout;