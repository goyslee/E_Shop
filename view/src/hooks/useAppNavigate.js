import { useNavigate } from 'react-router-dom';

const useAppNavigate = () => {
  const navigate = useNavigate();
  return navigate;
};

export default useAppNavigate;
