import { useState } from "react";
import { Box, Input, Text, Button, VStack, Heading, HStack, Icon, Flex } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { search_users } from "../api/endpoints";
import UserItem from "../components/userItem";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (query.length < 3) {
            alert('Enter at least 3 letters to search')
            return
        }
        const data = await search_users(query);
        setResults(data);
        console.log(data)
    };

    return (
        <Box
            minH="85vh"
            bg="gray.900"
            color="white"
            px={4}
        >
            {/* Search Bar Positioned at the Top */}
            <Flex
                w="100%"
                justify="center"
                py={6}
                borderBottom="1px solid"
                borderColor="gray.700"
                bg="gray.800"
                boxShadow="md"
                position="sticky"
                top="0"
                zIndex="10"
            >
                <HStack
                    w={{ base: "90%", md: "600px" }}
                    spacing={4}
                >
                    <Input
                        placeholder="Search for users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        focusBorderColor="red.500"
                        bg="gray.700"
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                    />
                    <Button
                        onClick={handleSearch}
                        colorScheme="red"
                        bg="red.600"
                        _hover={{ bg: "red.700" }}
                        px={6}
                    >
                        <Icon as={FaSearch} />
                    </Button>
                </HStack>
            </Flex>

            {/* Search Results Section */}
            <VStack spacing={6} mt={10} px={4}>
                <Heading fontSize="2xl" color="red.500">Search Results</Heading>
                {results.length === 0 ? (
                    <Text color="gray.400">No results found.</Text>
                ) : (
                    results.map((user) => (
                        <UserItem
                            key={user.username}
                            username={user.username}
                            first_name={user.first_name}
                            last_name={user.last_name}
                            profile_image={user.profile_image}
                            followingState={user.following_status}
                        />
                    ))
                )}
            </VStack>
        </Box>
    );
};

export default Search;
