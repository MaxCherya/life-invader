import { VStack, Text, Box, HStack, Avatar, IconButton } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { toggleLike as toggleLikeAPI } from "../api/endpoints";

const Post = ({ id, username, profile_image, description, formatted_date, liked, like_count }) => {
    const [isLiked, setLiked] = useState(liked);
    const [likes, setLikes] = useState(like_count);

    const toggleLike = async () => {
        try {
            const response = await toggleLikeAPI(id);

            if (response.now_liked !== undefined) {
                setLiked(response.now_liked);
                setLikes(response.now_liked ? likes + 1 : likes - 1);
            } else {
                console.error("Invalid API response:", response);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <Box
            w="100%"
            minW="100%"
            bg="gray.800"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            _hover={{ bg: "gray.700" }}
            transition="0.3s"
        >
            {/* Header: Avatar & Username */}
            <HStack spacing={3} align="center">
                <Avatar name={username} size="sm" src={profile_image} />
                <VStack align="start" spacing={0} flex="1">
                    <Text fontWeight="bold" color="white">@{username}</Text>
                    <Text fontSize="xs" color="gray.400">{formatted_date}</Text>
                </VStack>
            </HStack>

            {/* Post Content */}
            <Text mt={3} color="gray.300" fontSize="md">{description}</Text>

            {/* Footer: Like Button & Like Count */}
            <HStack mt={3} spacing={4} align="center">
                <IconButton
                    icon={isLiked ? <FaHeart /> : <FaRegHeart />}
                    aria-label="Like"
                    colorScheme="red"
                    variant="ghost"
                    fontSize="lg"
                    _hover={{ transform: "scale(1.2)" }}
                    transition="0.2s"
                    onClick={toggleLike}
                />
                <Text color="gray.400">{likes} {likes === 1 ? "Like" : "Likes"}</Text>
            </HStack>
        </Box>
    );
};

export default Post;