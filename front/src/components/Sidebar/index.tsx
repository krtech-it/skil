import { FC } from "react";
import { Avatar, H, Divider, P2 } from "@quark-uilib/components";
import { IconExit } from "@quark-uilib/icons";
import { useNavigate } from "react-router-dom";
import {
  LogoWrapper,
  SidebarWrapper,
  SidebarHeaderStyled,
  SidebarFooterStyled
} from "./styles";
import Logo from "src/assets/Logo.png";
import AvatarIcon from "src/assets/avatar.png";
import { ThemeSwitcher } from "src/services/theme";
import { clientRoutes } from "src/routes/constants";
import SidebarButton from "src/components/SidebarButton";
import { useStores } from "src/dal";

const Sidebar: FC = () => {
  const { AuthStore } = useStores();
  const navigate = useNavigate();

  const handleNavigateGeneralPage = (): void => {
    navigate(clientRoutes.home.path);
  };

  const handleClickLogout = (): void => {
    AuthStore.logout();
    navigate(clientRoutes.auth.path);
  };

  return (
    <SidebarWrapper>
      <SidebarHeaderStyled>
        <LogoWrapper onClick={handleNavigateGeneralPage}>
          <img src={Logo} />
          <H className="title" type="capricornus" size={16}>
            Атом.Знания
          </H>
        </LogoWrapper>
        <ThemeSwitcher size="l" />
        <Avatar size="l" image={AvatarIcon} status="online" />
        <P2 type="pavo">{AuthStore.user?.full_name}</P2>
        <P2 type="columba">
          {AuthStore.user?.admin ? "Наставник" : "Студент"}
        </P2>
        <Divider />
      </SidebarHeaderStyled>
      <SidebarFooterStyled>
        <SidebarButton onClick={handleClickLogout}>
          <IconExit />
        </SidebarButton>
      </SidebarFooterStyled>
    </SidebarWrapper>
  );
};

export default Sidebar;
