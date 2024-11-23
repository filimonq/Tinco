import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка наличия куки "auth"
    const isAuthenticated = Cookies.get('auth');

    if (isAuthenticated) {
      // Если пользователь авторизован, перенаправляем его на /profile
      navigate('/profile');
    } else {
      // Если пользователь не авторизован, перенаправляем его на /login
      navigate('/login');
    }
  }, [navigate]); // Зависимость от navigate для правильной работы хука

  return (
    <h1>HELLO</h1>
  );
}

export default Main;
