import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import Modal from '../components/Modal';
import { closeModal } from '../reducers/modals/actions';

let timer;

const InstanceStartupAd = ({ instanceName }) => {
  const dispatch = useDispatch();

  return (
    <Modal
      css={`
        height: 230px;
        width: 650px;
        overflow-x: hidden;
      `}
      title={`Starting up ${instanceName}`}
    >
      <div
        css={`
          display: flex;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        `}
      >
        <span
          css={`
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            margin-top: 20px;
          `}
        >
          Your instance is starting...
          <LoadingOutlined
            css={`
              margin-left: 30px;
              font-size: 50px;
            `}
          />
        </span>
      </div>
    </Modal>
  );
};

export default memo(InstanceStartupAd);
