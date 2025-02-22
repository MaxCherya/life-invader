import { Box, HStack, Avatar, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../constants/constants";

const UserItem = ({ username, first_name, last_name, profile_image }) => {
    const navigate = useNavigate();

    return (
        <Box
            w="100%"
            maxW="600px"
            bg="gray.800"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            _hover={{ bg: "gray.700", cursor: "pointer" }}
            transition="0.2s"
            onClick={() => navigate(`/${username}`)}
        >
            <HStack spacing={4} align="center">
                <Avatar name={username} src={SERVER_URL + profile_image} size="md" />
                <VStack align="start" spacing={0} flex="1">
                    <Text fontWeight="bold" color="white">@{username}</Text>
                    <Text fontSize="sm" color="gray.400">{first_name} {last_name}</Text>
                </VStack>
                <Button
                    size="sm"
                    colorScheme="red"
                    bg="red.600"
                    _hover={{ bg: "red.700" }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents navigating when clicking the button
                        alert(`Followed @${username}`);
                    }}
                >
                    Follow
                </Button>
            </HStack>
        </Box>
    );
};

export default UserItem;
