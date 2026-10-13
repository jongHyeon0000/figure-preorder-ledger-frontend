import { useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import useAuth from '@/app/auth/service/useAuth';
import { APP_ROUTES } from '@/config/route/RoutesConfig';
import { useUiStore } from '@/store/uiStore';

/*
* 상단 메뉴에 나올 라우트 (APP_ROUTES 에서 type 이 gnb 인 것)
* */
const GNB_ROUTES = APP_ROUTES.filter((route) => route.type === 'gnb');

/**
 * 상단 고정 메뉴바
 * 로그인하면 메뉴 탭과 프로필 메뉴가, 하지 않았으면 로그인 버튼이 보인다.
 */
const GNB = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const showSnackbar = useUiStore((state) => state.showSnackbar);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /* 현재 주소가 속한 메뉴 탭 (상품 상세 같은 하위 주소도 '상품' 탭으로 본다) */
  const activeRoute = GNB_ROUTES.find((route) => pathname === route.path || pathname.startsWith(`${route.path}/`));

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleMyPage = () => {
    handleCloseMenu();
    navigate('/my-page');
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login', { replace: true });
    showSnackbar('로그아웃되었습니다.', 'success');
  };

  return (
    <GnbBar position="sticky" elevation={0}>
      <Toolbar>
        <Brand variant="h6" component={Link} to="/">
          피규어 예약 장부
        </Brand>

        {isAuthenticated ? (
          <>
            <Tabs value={activeRoute?.path ?? false} sx={{ flexGrow: 1, ml: 3 }}>
              {GNB_ROUTES.map((route) => (
                <Tab key={route.path} value={route.path} label={route.nameKr} component={Link} to={route.path} />
              ))}
            </Tabs>

            <IconButton aria-label="프로필 메뉴" onClick={handleOpenMenu}>
              <AccountCircleOutlinedIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={handleCloseMenu}>
              <MenuName variant="subtitle2">{user?.name}</MenuName>
              <Divider />
              <MenuItem onClick={handleMyPage}>
                <ListItemIcon>
                  <PersonOutlinedIcon fontSize="small" />
                </ListItemIcon>
                마이페이지
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                로그아웃
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Spacer />
            <Button color="primary" component={Link} to="/login">
              로그인
            </Button>
          </>
        )}
      </Toolbar>
    </GnbBar>
  );
};

export default GNB;

/* ───────── styles ───────── */

const GnbBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Brand = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
})) as typeof Typography;

const MenuName = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
})) as typeof Typography;

const Spacer = styled('div')({ flexGrow: 1 });
