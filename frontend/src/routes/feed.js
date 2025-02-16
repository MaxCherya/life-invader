import { Flex, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getPosts } from "../api/endpoints";
import Post from "../components/post";
import { SERVER_URL } from "../constants/constants";

const Feed = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [nextPage, setNextPage] = useState(1);

    const fetchPosts = async () => {
        if (!nextPage) return;

        try {
            const data = await getPosts(nextPage);

            setPosts((prevPosts) => [...prevPosts, ...data.results]); // Append new posts
            setNextPage(data.next ? nextPage + 1 : null); // Update next page
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Flex w="100vw" minH="100vh" justify="center" align="center" py={10} bg="gray.900">
            <VStack spacing={6} w={{ base: "90%", md: "75%", lg: "60%" }} color="white">
                {/* Feed Header */}
                <Heading fontSize="2xl" color="red.500">Feed</Heading>

                {/* Loading Indicator */}
                {loading && <Text color="gray.400">Loading...</Text>}

                {/* Posts List */}
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
                            username={post.username}
                            profile_image={`${SERVER_URL}${post.profile_image}`}
                            description={post.description}
                            formatted_date={post.formatted_date}
                            liked={post.liked}
                            like_count={post.like_count}
                        />
                    ))
                ) : (
                    !loading && <Text color="gray.500">No posts available</Text>
                )}

                {/* Load More Button */}
                {nextPage && !loading && (
                    <Button
                        mt={4}
                        w="full"
                        maxW="300px"
                        colorScheme="red"
                        bg="red.600"
                        _hover={{ bg: "red.700" }}
                        onClick={fetchPosts}
                    >
                        Load More Posts
                    </Button>
                )}
            </VStack>
        </Flex>
    );
};

export default Feed;