import { useState } from "react";
import { Box, Input, Button, VStack, Heading, Avatar, Textarea, FormControl, FormLabel, IconButton } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { update_user } from "../api/endpoints";
import { SERVER_URL } from "../constants/constants";

const Settings = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const [username, setUsername] = useState(user.username || "");
    const [firstName, setFirstName] = useState(user.first_name || "");
    const [lastName, setLastName] = useState(user.last_name || "");
    const [bio, setBio] = useState(user.bio || "");
    const [profileImage, setProfileImage] = useState(user.profile_image ? `${SERVER_URL}${user.profile_image}` : "");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => setProfileImage(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("bio", bio);
        if (selectedFile) {
            formData.append("profile_image", selectedFile);
        }

        try {
            const updatedUser = await update_user(formData);

            if (updatedUser) {
                const newUserData = {
                    username: updatedUser.username,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    bio: updatedUser.bio,
                    profile_image: updatedUser.profile_image,
                };

                setUser(newUserData);
                localStorage.setItem("userData", JSON.stringify(newUserData));

                alert("Profile updated successfully!");
            } else {
                alert("Error: No response from server.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again.");
        }
    };


    return (
        <Box
            minH="85vh"
            bg="gray.900"
            color="white"
            px={6}
            py={10}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Heading fontSize="2xl" color="red.500" mb={6}>Settings</Heading>

            <VStack w={{ base: "90%", md: "500px" }} spacing={5} bg="gray.800" p={6} borderRadius="lg" boxShadow="lg">
                {/* Profile Picture Upload */}
                <FormControl position="relative" display="flex" justifyContent="center" alignItems="center">
                    {/* Profile Image */}
                    <Box position="relative" boxSize="120px">
                        <Avatar size="full" src={profileImage ? profileImage : ""} boxSize="100%" borderRadius="full" />

                        {/* Upload Button */}
                        <IconButton
                            as="label"
                            htmlFor="fileUpload"
                            icon={<FaUpload />}
                            colorScheme="red"
                            bg="red.600"
                            _hover={{ bg: "red.700" }}
                            size="sm"
                            borderRadius="full"
                            position="absolute"
                            bottom={0}
                            right={0}
                            transform="translate(25%, 25%)"
                            boxShadow="md"
                        />
                    </Box>
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        hidden
                        id="fileUpload"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </FormControl>

                {/* Username */}
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        bg="gray.700"
                        focusBorderColor="red.500"
                        color="white"
                    />
                </FormControl>

                {/* First Name */}
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        bg="gray.700"
                        focusBorderColor="red.500"
                        color="white"
                    />
                </FormControl>

                {/* Last Name */}
                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        bg="gray.700"
                        focusBorderColor="red.500"
                        color="white"
                    />
                </FormControl>

                {/* Bio */}
                <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        bg="gray.700"
                        focusBorderColor="red.500"
                        color="white"
                        resize="none"
                    />
                </FormControl>

                {/* Save Button */}
                <Button
                    w="full"
                    colorScheme="red"
                    bg="red.600"
                    _hover={{ bg: "red.700" }}
                    onClick={handleSaveChanges}
                >
                    Save Changes
                </Button>
            </VStack>
        </Box>
    );
};

export default Settings;