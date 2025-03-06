import { Box, HStack, Avatar, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../constants/constants";
import { toggleFollow } from "../api/endpoints";
import { useState } from "react";

const UserItem = ({ username, first_name, last_name, profile_image, followingState }) => {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(followingState)

    const handleToggleFollow = async (e) => {
        e.stopPropagation()
        try {
            const data = await toggleFollow(username);
            if (data.now_following) {
                setIsFollowing(true)
            }
            else {
                setIsFollowing(false)
            }
        } catch (err) {
            console.log('error')
        }
    }

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
                <Avatar name={username} src={profile_image} size="md" />
                <VStack align="start" spacing={0} flex="1">
                    <Text fontWeight="bold" color="white">@{username}</Text>
                    <Text fontSize="sm" color="gray.400">{first_name} {last_name}</Text>
                </VStack>
                <Button
                    size="sm"
                    colorScheme={isFollowing ? "gray" : "red"}
                    bg={isFollowing ? "gray.600" : "red.600"}
                    _hover={{ bg: isFollowing ? "gray.700" : "red.700" }}
                    onClick={handleToggleFollow}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            </HStack>
        </Box>
    );
};

export default UserItem;
