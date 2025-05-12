
function Home() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [bgColor, setBgColor] = useState('#f9fbfa');

  const textsToType = [
    "Send attendance directly to parents",
    "Share marks and academic progress",
    "Notify results and school events"
  ];

  useEffect(() => {
    const colors = ['#f9fbfa', '#f0f7fa', '#e8f4fa', '#f0faf9', '#f9fbfa'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setBgColor(colors[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textsToType[loopNum % textsToType.length];
      const updatedText = isDeleting
        ? currentText.substring(0, text.length - 1)
        : currentText.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }

      setTypingSpeed(isDeleting ? 75 : 150);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const floatingIcons = [
    {
      icon: <FiBook className="text-blue-400" size={36} />,
      style: { top: '10%', left: '20%' },
      floatX: 10, floatY: 5
    },
    {
      icon: <FiBookOpen className="text-purple-400" size={36} />,
      style: { top: '20%', right: '15%' },
      floatX: 8, floatY: 6
    },
    {
      icon: <FiAward className="text-yellow-400" size={36} />,
      style: { bottom: '20%', left: '12%' },
      floatX: 12, floatY: 8
    },
    {
      icon: <FiUsers className="text-red-400" size={36} />,
      style: { bottom: '10%', right: '18%' },
      floatX: 10, floatY: 5
    },
    {
      icon: <FiLayers className="text-indigo-400" size={36} />,
      style: { top: '10%', right: '30%' },
      floatX: 6, floatY: 4
    },
    {
      icon: <FiPieChart className="text-teal-400" size={36} />,
      style: { bottom: '15%', left: '30%' },
      floatX: 6, floatY: 6
    },
    {
      icon: <FiBarChart2 className="text-orange-400" size={36} />,
      style: { top: '25%', left: '5%' },
      floatX: 8, floatY: 4
    }
  ];

  return (
<
  );
}

export default Home;