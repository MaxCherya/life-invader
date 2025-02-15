import { useState } from "react";
import { Box, Input, Button, VStack, Heading, Text, Link, Divider } from "@chakra-ui/react";
import { login } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const data = await login(username, password)
        if (data.success) {
            navigate(`/${username}`)
        } else {
            alert('Invalid email or password')
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" py={10} bg="gray.900" color="white">
            <VStack w={{ base: "90%", md: "400px" }} spacing={6} p={6} bg="gray.800" borderRadius="lg" boxShadow="lg">
                {/* LifeInvader Logo + Slogan */}
                <VStack spacing="0px" textAlign="center" color='red.500'>
                    <Text fontSize="3xl" lineHeight="1">
                        <Text as="span" fontWeight="bold">Life</Text>Invader
                    </Text>
                    <Text fontSize="md" lineHeight="1.2">
                        It's not Technology, it's your life!
                    </Text>
                </VStack>
                <Divider borderColor="gray.700" />
                <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Button w="full" colorScheme="red" bg="red.600" _hover={{ bg: "red.700" }} onClick={handleLogin}>Login</Button>
                <Divider borderColor="gray.700" />
                <Text>
                    Don't have an account? <Link color="red.400" href="/register">Create New Account</Link>
                </Text>
            </VStack>
        </Box>
    );
};

export default LoginPage;