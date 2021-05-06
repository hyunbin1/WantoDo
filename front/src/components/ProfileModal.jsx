import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Modal from '../container/Modal';
import ProfileImage from './ProfileImage';
import Button from './Button';
import styles from '../styles/ProfileModal.module.css';
import GoogleLogoutButton from './GoogleLogoutButton';

/**
 * 모달 프레임에 들어갈 프로필 모달
 * @param {Object} props - 사용자의 프로필 정보를 담고있는 객체
 * @param {string} props.imageURL - 사용자 프로필 이미지 URL 문자열
 * @param {string} props.userName - 사용자 이름 문자열
 * @param {string} props.email - 사용자 email 문자열
 * @param {string} props.motto - 사용자의 좌우명 문자열
 * @param {string} props.goal - 사용자의 목표 문자열
 */
const ProfileModal = ({ imageURL, userName, email, motto }) => {
  const history = useHistory();

  const onEditClick = () => {
    // 프로필 수정 폼으로 모달 변경
  };

  const onLogout = () => {
    // 로그아웃 처리
    history.push('/login');
  };

  return (
    <Modal styleName="profileModal">
      <header className={styles.header}>
        <div className={styles.profile}>
          <ProfileImage imageURL={imageURL} styleName="profileModal" />
        </div>
        <h3 className={styles.name}>{userName || 'anonymous'}</h3>
        <p className={styles.email}>{email || '이메일 정보를 찾을 수 없습니다.'}</p>
      </header>
      <ul className={styles.intros}>
        <li className={styles.intro}>
          <span className={styles.mottoTitle}>MOTTO</span>
          <span className={styles.text}>{motto || '좌우명을 등록해보세요.'}</span>
        </li>
      </ul>
      <footer className={styles.footer}>
        <Button styleName="profileModal" onClick={onEditClick}>
          프로필 수정
        </Button>
        <GoogleLogoutButton onLogout={onLogout} />
      </footer>
    </Modal>
  );
};

const mapStateToProps = ({ profile: { imageURL, userName, email, motto, goal } }) => {
  return { imageURL, userName, email, motto, goal };
};

export default connect(mapStateToProps)(ProfileModal);
