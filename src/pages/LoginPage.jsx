import React, { useContext, useState } from "react";
import authService from "../services/auth.service";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("Both email and password are required");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = () => {
    if (!validateForm()) return;

    const requestBody = { email, password };
    setIsLoading(true);

    authService
      .login(requestBody)
      .then((response) => {
        console.log("JWT token", response.data.authToken);
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "An error occurred during login";
        setErrorMessage(errorDescription);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h1>Login Page</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={handleLoginSubmit}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              value={email}
              placeholder="Email"
              onChange={handleEmail}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type={password}
              value={password}
              onChange={handlePassword}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="unchecked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          {errorMessage && (
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <div style={{ color: "red" }}>{errorMessage}</div>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
