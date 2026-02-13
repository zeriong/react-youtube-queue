import { useNavigate } from "@tanstack/react-router";
import { useModeStore } from "@/entities/mode/model";
import { useTokenStore } from "@/entities/user/model";
import { SINGLE_MODE_TOKEN } from "@/shared/constants/single-mode";
import { setAuthStorage } from "@/shared/utils/auth";

export const useSingleModeEntry = () => {
  const navigate = useNavigate();
  const { setIsSingleMode } = useModeStore();
  const { setToken } = useTokenStore();

  const enterSingleMode = () => {
    setIsSingleMode(true);
    setAuthStorage(SINGLE_MODE_TOKEN);
    setToken(SINGLE_MODE_TOKEN);
    navigate({ to: "/main/player" });
  };

  return { enterSingleMode };
};

export const useSingleModeLogout = () => {
  const navigate = useNavigate();
  const { setIsSingleMode } = useModeStore();
  const { deleteToken } = useTokenStore();

  const exitSingleMode = () => {
    setIsSingleMode(false);
    deleteToken();
    navigate({ to: "/" });
  };

  return { exitSingleMode };
};
