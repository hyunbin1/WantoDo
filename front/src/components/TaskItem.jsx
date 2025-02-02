import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { connect } from 'react-redux';
import { actionCreators } from '../store/store';
import CheckButton from './CheckButton';
import IconButton from './IconButton';
import PriorityIcon from './PriorityIcon';
import styles from '../styles/TaskItem.module.css';
import timeparser from '../utils/timestamp-parser';

/** Created by 오영롱(youngrongoh) on 2021/04/20
 * 전단받은 사용자의 태스크 정보를 투두 형식으로 보여주는 아이템
 * @param {Object} props.task -
 * @param {'basic' | 'daily'} props.type - 태스크 아이템에서 기간(period)에 대한 표시 여부를 결정하는 문자열
 */
const TaskItem = ({ taskId, task, type, updateTask, deleteTask }) => {
  const { level, checked, content, periods } = task;
  const isPeriodsRender = periods && type === 'daily';

  const onCheckClick = (_, _checked) => {
    const updated = { ...task };
    updated.checked = _checked;
    updateTask(taskId, updated);
  };

  const onDeleteClick = () => {
    deleteTask(taskId);
  };

  return (
    <li className={styles.task}>
      <div className={styles.elements}>
        <div className={styles.checkcontent}>
          <CheckButton checked={checked} onClick={onCheckClick} />
          <span className={`${styles.content} ${checked && styles.checked}`}>{content}</span>
        </div>
        <div className={styles.iconbuttons}>
          <PriorityIcon level={level} />
          <IconButton Icon={AiFillDelete} styleName="todoDeleteButton" onClick={onDeleteClick} />
        </div>
      </div>
      {isPeriodsRender && <span className={styles.period}>{timeparser.parsePeriods(periods)}</span>}
    </li>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTask: (id, task) => dispatch(actionCreators.updateTask({ id, content: task })),
    deleteTask: (id) => dispatch(actionCreators.deleteTask(id)),
  };
};

export default connect(undefined, mapDispatchToProps)(TaskItem);
