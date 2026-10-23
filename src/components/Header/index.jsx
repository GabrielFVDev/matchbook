import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    HeaderContainer,
    HeaderContent,
    NavigationContainer,
    NavItem,
    LogoutButton,
    RightSide,
    MobileOnly,
    Counter
} from "./styles.module.jsx";
import { Logo } from "../Logo";
import { IconHeart } from "../Icons";
import { useAuth } from "../../hooks/useAuth";
import { useCurtidos } from "../../contexts/curtidos";
import { cores } from "../../styles/tokens";

export default function Header({ corDestaque = cores.marca, acaoCelular }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { total, carregar } = useCurtidos();

    useEffect(() => {
        carregar();
    }, [carregar]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <HeaderContainer>
            <HeaderContent>
                <Logo para="/home" />
                <NavigationContainer aria-label="Principal">
                    <NavItem to="/home">Início</NavItem>
                    <NavItem to="/meus-livros">Meus livros</NavItem>
                    <NavItem to="/adicionar-livro">Adicionar livro</NavItem>
                    <NavItem to="/profile">Perfil</NavItem>
                    <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
                </NavigationContainer>
                <RightSide>
                    {acaoCelular && <MobileOnly>{acaoCelular}</MobileOnly>}
                    {total !== null && (
                        <Counter $cor={corDestaque}>
                            <IconHeart tamanho={15} />
                            <span><strong>{total}</strong> curtidos</span>
                        </Counter>
                    )}
                </RightSide>
            </HeaderContent>
        </HeaderContainer>
    );
}
