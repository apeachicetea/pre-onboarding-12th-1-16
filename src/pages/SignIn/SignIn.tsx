import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Vaildate from '../../custom/Vaildate';
import { SignInHandle } from '../../util/UserUtil';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.h1`
  color: #ffffff;
`;

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PasswordWrapper = styled(EmailWrapper)``;

const SignInForm = styled.form`
  width: 450px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background: linear-gradient(to right, #ff4b2b, #ff416c);
  border-radius: 10px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
`;

const Label = styled.label`
  font-weight: bold;
  font-size: x-large;
  margin-bottom: 5px;
`;

const EmailInput = styled.input`
  width: 300px;
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin-bottom: 5px;
`;

const PasswordInput = styled(EmailInput)``;

const ErrorMsg = styled.p``;

const SignInBtn = styled.button`
  border-radius: 20px;
  border: 1px solid #ffffff;
  background-color: transparent;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  margin-top: 20px;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
`;

const SignIn = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    enableButton,
    handleEmailChange,
    handlePasswordChange,
  } = Vaildate();

  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableButton) return;
    try {
      const result = await SignInHandle(email, password);
      if (result.status === 200 && result.data.access_token) {
        alert('환영합니다.');
        localStorage.setItem('jwt_token', result.data.access_token);
        setError('');
        setEmail('');
        setPassword('');
        navigate('/todo');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message);
      } else {
        console.error(err);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem('jwt_token')) navigate('/todo');
  }, [navigate]);

  return (
    <Container>
      <SignInForm onSubmit={handleSignIn}>
        <Text>Sign In</Text>
        <EmailWrapper>
          <Label htmlFor="">Email</Label>
          <EmailInput
            type="text"
            data-testid="email-input"
            placeholder="example@email.com"
            onChange={e => handleEmailChange(e)}
            value={email}
          />
        </EmailWrapper>
        <PasswordWrapper>
          <Label htmlFor="">Password</Label>
          <PasswordInput
            type="password"
            data-testid="password-input"
            placeholder="password"
            value={password}
            onChange={e => handlePasswordChange(e)}
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </PasswordWrapper>
        <div>
          <SignInBtn
            data-testid="signin-button"
            type="submit"
            disabled={enableButton ? false : true}
          >
            Sign In
          </SignInBtn>
        </div>
      </SignInForm>
    </Container>
  );
};

export default SignIn;
