import {
    Flex, HStack, VStack, IconButton, Drawer, DrawerBody, DrawerHeader,
    DrawerOverlay, DrawerContent, useDisclosure, useBreakpointValue, Tooltip, Text
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaUser, FaCog, FaPlus, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../api/endpoints";
import { useEffect, useState } from "react";

const Navbar = () => {
    const nav = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useState([])

    const handleNavigate = (route) => {
        nav(`/${route}`);
        onClose();
    };

    useEffect(() => {
        setUserData(JSON.parse(localStorage.getItem('userData')) || {});
    }, [])

    const handleLogout = async () => {
        localStorage.removeItem("userData");
        await logout()
        nav("/login");
    };

    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Flex w="100vw" h="15svh" bg="#c0392b" justifyContent="center" alignItems="center" px={5}>
            <HStack justifyContent="space-between" w="100%" maxW="1200px">
                {/* LifeInvader Logo + Slogan */}
                <VStack onClick={() => nav('/feed')} spacing="0px" textAlign="center" _hover={{ cursor: 'pointer' }}>
                    <Tooltip label="Go to Feed" placement="bottom">
                        <VStack spacing="0px">
                            <Flex fontSize="3xl" color="white" fontWeight="bold">
                                <span style={{ color: "#ecf0f1" }}>Life</span>Invader
                            </Flex>
                            <Flex fontSize="md" color="white" lineHeight="1.2">
                                It's not Technology, it's your life!
                            </Flex>
                        </VStack>
                    </Tooltip>
                </VStack>

                {/* Desktop Navigation with Icons */}
                {!isMobile ? (
                    <HStack spacing={6}>
                        <Tooltip label="Profile" placement="bottom">
                            <IconButton
                                icon={<FaUser />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                fontSize="xl"
                                onClick={() => handleNavigate(userData.username)}
                            />
                        </Tooltip>

                        <Tooltip label="Settings" placement="bottom">
                            <IconButton
                                icon={<FaCog />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                fontSize="xl"
                                onClick={() => handleNavigate("settings")}
                            />
                        </Tooltip>

                        <Tooltip label="Add Post" placement="bottom">
                            <IconButton
                                icon={<FaPlus />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                fontSize="xl"
                                onClick={() => handleNavigate("create-post")}
                            />
                        </Tooltip>

                        <Tooltip label="Search Users" placement="bottom">
                            <IconButton
                                icon={<FaSearch />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                fontSize="xl"
                                onClick={() => handleNavigate("search")}
                            />
                        </Tooltip>

                        <Tooltip label="Logout" placement="bottom">
                            <IconButton
                                icon={<FaSignOutAlt />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                fontSize="xl"
                                onClick={handleLogout}
                            />
                        </Tooltip>
                    </HStack>
                ) : (
                    // Mobile Hamburger Menu
                    <IconButton
                        icon={<HamburgerIcon />}
                        color="white"
                        variant="unstyled"
                        aria-label="Open Menu"
                        onClick={onOpen}
                    />
                )}
            </HStack>

            {/* Mobile Drawer Navigation */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="gray.900" color="white">
                    <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
                        Menu
                        <IconButton icon={<CloseIcon />} variant="unstyled" aria-label="Close Menu" onClick={onClose} />
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4}>
                            <HStack cursor="pointer" onClick={() => handleNavigate(userData.username)}>
                                <IconButton
                                    icon={<FaUser />}
                                    aria-label="Profile"
                                    variant="ghost"
                                    color='#d6d6d6'
                                    fontSize="lg"
                                />
                                <Text fontSize="lg">Profile</Text>
                            </HStack>

                            <HStack cursor="pointer" onClick={() => handleNavigate("settings")}>
                                <IconButton
                                    icon={<FaCog />}
                                    aria-label="Settings"
                                    variant="ghost"
                                    color='#d6d6d6'
                                    fontSize="lg"
                                />
                                <Text fontSize="lg">Settings</Text>
                            </HStack>

                            <HStack cursor="pointer" onClick={() => handleNavigate("create-post")}>
                                <IconButton
                                    icon={<FaPlus />}
                                    aria-label="Add Post"
                                    variant="ghost"
                                    color='#d6d6d6'
                                    fontSize="lg"
                                />
                                <Text fontSize="lg">Add Post</Text>
                            </HStack>

                            <HStack cursor="pointer" onClick={() => handleNavigate("search")}>
                                <IconButton
                                    icon={<FaSearch />}
                                    aria-label="Search Users"
                                    variant="ghost"
                                    color='#d6d6d6'
                                    fontSize="lg"
                                />
                                <Text fontSize="lg">Search</Text>
                            </HStack>

                            <HStack cursor="pointer" onClick={handleLogout}>
                                <IconButton
                                    icon={<FaSignOutAlt />}
                                    aria-label="Logout"
                                    colorScheme="red"
                                    variant="ghost"
                                    fontSize="lg"
                                />
                                <Text fontSize="lg">Logout</Text>
                            </HStack>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
};

export default Navbar;