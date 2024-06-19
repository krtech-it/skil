import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Form, Input, Button, Label } from "@quark-uilib/components";
import { useNavigate } from "react-router-dom";
import { IconLogin } from "@quark-uilib/icons";
import { FormWrapper, ModalWindowStyled } from "./styles";
import { useStores } from "src/dal";
import { clientRoutes } from "src/routes/constants";
import { ILogin } from "src/modules/auth/types";

const Login: React.FC = observer(() => {
  const [error, setError] = useState("");
  const form = Form.useForm<ILogin>();
  const navigate = useNavigate();
  const { AuthStore } = useStores();

  useEffect(() => {
    if (AuthStore.isAuth) {
      navigate(clientRoutes.home.path);
    }
  }, [AuthStore.isAuth]);

  const handleLogin = async (values: ILogin): Promise<void> => {
    try {
      await AuthStore.login(values);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.code === "Enter") {
      form.submit();
    }
  };

  

  return (
    <ModalWindowStyled
      title="Войдите в систему"
      isOpen={true}
      description="Введите логин и пароль для ввода в систему"
      isHiddenCloseButton={true}
      footerContent={
        <>
          <Button onClick={form.submit} icon={<IconLogin />}>
            Войти
          </Button>
        </>
      }>
      <FormWrapper<ILogin> form={form} onFinish={handleLogin}>
        <Form.Field
          name="username"
          rules={[
            { required: true, message: "Поле обязательно для заполнения" }
          ]}>
          <Input placeholder="Логин" onKeyDown={handleKeyDown} />
        </Form.Field>
        <Form.Field
          name="password"
          rules={[
            { required: true, message: "Поле обязательно для заполнения" }
          ]}>
          <Input
            placeholder="Пароль"
            type="password"
            onKeyDown={handleKeyDown}
          />
        </Form.Field>
        {error && <Label status="error">{error}</Label>}
      </FormWrapper>
    </ModalWindowStyled>
  );
});

export default Login;
