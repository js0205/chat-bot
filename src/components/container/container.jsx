import './container.css'; // 确保引入了正确的样式表
import { useSelector } from 'react-redux';
import Chatbot from '../../pages/chatBot/index'
import Spice from '../../pages/spice/index'
import GuangkeBot from '../../pages/guangke/index'
import TACD from '../../pages/tcad/index'
import ImageBot from '../../pages/fab/fabGPT';
import ClassIntroduce from '../../pages/classIntroduce/index'





function Container() {
  const mainPage = useSelector((state) => state.PageState.Main_Page);
  const subPage = useSelector((state) => state.PageState.Sub_Page);


  return (
    <div className='container'>
      <div className='root-container'>
        {mainPage === 'ClassIntroduce' && <ClassIntroduce />}

        {mainPage === 'ChatBot' && <Chatbot port="5002" />}
        {/* 其他内容也可以放在这里 */}
        {mainPage === 'FabGPT' &&
          <>
            {subPage === "issue" && <ImageBot />}
            {subPage === "lithgraphy" && <GuangkeBot port="5003" />}
            {subPage === "tcad" && <TACD port="5004" />}
            {subPage === "spice" && <Spice port="5005" />}
          </>}
      </div>

    </div>
  );
}

export default Container;