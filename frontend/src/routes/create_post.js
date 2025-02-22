import { useState } from "react";
import { Box, VStack, Input, Button, Text, Heading, Textarea, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/endpoints";

const CreatePostPage = () => {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreatePost = async () => {
        if (!description.trim()) {
            alert("Post description cannot be empty!");
            return;
        }

        setLoading(true);
        try {
            await createPost(description);
            navigate('/feed')
        } catch (error) {
            alert("Error creating post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="85vh" py={10} bg="gray.900" color="white">
            <VStack w={{ base: "90%", md: "500px" }} spacing={6} p={6} bg="gray.800" borderRadius="lg" boxShadow="lg">
                <Heading size="lg" color="red.500">Create a Post</Heading>
                <Divider borderColor="gray.700" />

                <Textarea
                    placeholder="What's on your mind?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    focusBorderColor="red.500"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    resize="none"
                    rows={5}
                    maxLength={400}
                />

                <Text fontSize="sm" color="gray.400">
                    {description.length} / 400
                </Text>

                <Button
                    w="full"
                    colorScheme="red"
                    bg="red.600"
                    _hover={{ bg: "red.700" }}
                    _active={{ transform: "scale(0.95)" }}
                    transition="0.2s"
                    isLoading={loading}
                    onClick={handleCreatePost}
                >
                    Post
                </Button>

                <Button
                    w="full"
                    bg="gray.700"
                    _hover={{ bg: "gray.600" }}
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
            </VStack>
        </Box>
    );
};

export default CreatePostPage;