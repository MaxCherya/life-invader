import { useState } from "react";
import { Box, Input, Button, VStack, Heading, Text, Link, Divider } from "@chakra-ui/react";
import { register } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        const { username, email, first_name, last_name, password } = formData;
        try {
            const data = await register(username, email, first_name, last_name, password);
            if (data.email || data.username || data.first_name || data.last_name) {
                let errorMessage = "";
                for (const key in data) {
                    if (Array.isArray(data[key])) {
                        errorMessage += `${data[key].join(", ")}\n`;
                    } else {
                        errorMessage += `${data[key]}\n`;
                    }
                }
                alert(errorMessage);
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" py={10} bg="gray.900" color="white">
            <VStack w={{ base: "90%", md: "400px" }} spacing={6} p={6} bg="gray.800" borderRadius="lg" boxShadow="lg">
                <Heading size="lg" color="red.500">Create Account</Heading>
                <Divider borderColor="gray.700" />
                <Input
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Input
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Input
                    placeholder="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Input
                    placeholder="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <Button w="full" colorScheme="red" bg="red.600" _hover={{ bg: "red.700" }} onClick={handleRegister}>Register</Button>
                <Divider borderColor="gray.700" />
                <Text>
                    Already have an account? <Link color="red.400" href="/login">Login</Link>
                </Text>
            </VStack>
        </Box>
    );
};

export default RegisterPage;