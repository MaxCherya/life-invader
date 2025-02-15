import { Flex, HStack, Text, VStack, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, useDisclosure, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Navbar = () => {
    const nav = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleNavigate = (route) => {
        nav(`/${route}`);
        onClose();
    };

    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Flex w="100vw" h="90px" bg="#c0392b" justifyContent="center" alignItems="center" px={5}>
            <HStack justifyContent="space-between" w="100%" maxW="1200px">
                {/* LifeInvader Logo + Slogan */}
                <VStack spacing="0px" textAlign="center">
                    <Text fontSize="3xl" color="white" lineHeight="1">
                        <Text as="span" fontWeight="bold">Life</Text>Invader
                    </Text>
                    <Text fontSize="md" color="white" lineHeight="1.2">
                        It's not Technology, it's your life!
                    </Text>
                </VStack>

                {/* Desktop Navigation */}
                {!isMobile ? (
                    <HStack spacing={6}>
                        <Text color="white" fontSize="lg" cursor="pointer" _hover={{ opacity: 0.8 }} onClick={() => handleNavigate("maxchergik")}>
                            Profile
                        </Text>
                        <Text color="white" fontSize="lg" cursor="pointer" _hover={{ opacity: 0.8 }} onClick={() => handleNavigate("settings")}>
                            Settings
                        </Text>
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
                            <Text fontSize="lg" cursor="pointer" _hover={{ opacity: 0.8 }} onClick={() => handleNavigate("maxchergik")}>
                                Profile
                            </Text>
                            <Text fontSize="lg" cursor="pointer" _hover={{ opacity: 0.8 }} onClick={() => handleNavigate("settings")}>
                                Settings
                            </Text>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
};

export default Navbar;