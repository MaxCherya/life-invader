import { Flex, Text, VStack, Box, Heading, HStack, Image, Button, Divider, Spacer } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { get_user_profile_data, toggleFollow } from "../api/endpoints";
import { SERVER_URL } from "../constants/constants";
import { useParams } from "react-router-dom";

const UserProfile = () => {

    const { username } = useParams();

    return (
        <Flex w="100%" justify="center" minH="100vh" py={10}>
            <VStack w={{ base: "90%", md: "75%", lg: "60%" }} spacing={6} color="white">

                {/* User Details Section */}
                <UserDetails username={username} />
            </VStack>
        </Flex>
    )
}

const UserDetails = ({ username }) => {

    const [loading, setLoading] = useState(true)
    const [bio, setBio] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [isOurProfile, setIsOurProfile] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    const handleToggleFollow = async () => {
        try {
            const data = await toggleFollow(username);
            if (data.now_following) {
                setFollowerCount(followerCount + 1)
                setIsFollowing(true)
            }
            else {
                setFollowerCount(followerCount - 1)
                setIsFollowing(false)
            }
        } catch (err) {
            console.log('error')
        }
    }

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await get_user_profile_data(username)
                setBio(data.bio)
                setProfileImage(data.profile_image)
                setFollowerCount(data.follower_count)
                setFollowingCount(data.following_count)
                setIsOurProfile(data.is_our_profile)
                setIsFollowing(data.isFollowing)
            } catch (error) {
                console.log("error")
            } finally {
                setLoading(false)
            }
        }
        fetchData()

    }, [username])

    if (loading) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
        <VStack align="center" w="100%" spacing={5} p={6} bg="gray.900" borderRadius="lg" boxShadow="lg">
            {/* Profile Image & Username */}
            <VStack spacing={3}>
                <Box boxSize="120px" border="2px solid" borderColor="gray.600" borderRadius="full" overflow="hidden">
                    <Image src={loading ? '' : `${SERVER_URL}${profileImage}`} boxSize="100%" objectFit="cover" />
                </Box>
                <Heading fontSize="2xl">@{username}</Heading>
                {/* Bio Section */}
                <Text fontSize="md" opacity={0.8} textAlign="center">
                    {loading ? '-' : bio}
                </Text>
            </VStack>

            <Divider borderColor="gray.700" />

            {/* Stats */}
            <HStack spacing={8} fontSize="lg">
                <StatBox label="Followers" count={loading ? '-' : followerCount} />
                <StatBox label="Following" count={loading ? '-' : followingCount} />
            </HStack>

            {loading ? <Spacer /> : isOurProfile ?
                /* Edit Profile Button */
                <Button w="full" colorScheme="red" bg="gray.700" _hover={{ bg: "gray.600" }}>
                    Edit Profile
                </Button>
                :
                /* Follow Button */
                <Button
                    w="full"
                    colorScheme="red"
                    bg={isFollowing ? "gray.700" : "red.600"}
                    _hover={{ bg: isFollowing ? "gray.600" : "red.700" }}
                    fontSize="lg"
                    fontWeight="bold"
                    transition="all 0.2s ease-in-out"
                    boxShadow="md"
                    _active={{ transform: "scale(0.95)" }}
                    onClick={handleToggleFollow}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>}
        </VStack>
    )
}

// Reusable Stats Box Component
const StatBox = ({ label, count }) => (
    <VStack>
        <Text fontSize="xl" fontWeight="bold">{count}</Text>
        <Text fontSize="md" opacity={0.8}>{label}</Text>
    </VStack>
)

export default UserProfile;