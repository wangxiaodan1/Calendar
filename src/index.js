import React, { PropTypes } from 'react';
import * as Immutable from 'immutable';
import * as styles from './styles/styles.css';
import moment from 'moment';

const ROWNUMBER = 5;
const COLNUMBER = 7;
const currentYear = moment().year();
const currentMonth = moment().month() + 1;
const currentDay = moment().dates();
const currentTime = moment().format('h:mm A');

/**
 * @width 日历宽度
 * @height 日历高度
 * @onSelectDays 选中的日期  数组[string, string]
 * @disabledDays 不可选时间  ［number, number］ 不可选周几
 * @disabledDates 不可选时间范围 number  时间戳
 * @min 最小可选日期
 * @max 最大可选日期
 */
class Calendar extends React.Component {
  static defaultProps = {
    width: document.body.clientWidth,
    height: document.body.clientWidth,
    onSelectDays: [],
    disabledDays: [],
    disabledDates: 0,
    // min: PropTypes.array,
    // max: PropTypes.array,
    onClick: PropTypes.func,
  };
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onSelectDays: PropTypes.array,
    disabledDays: PropTypes.array,
    disabledDates: PropTypes.number,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    // min: PropTypes.array,
    // max: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.state = {
      selectYear: currentYear,
      selectMonth: currentMonth,
      selectDay: currentDay,
    };
  }

  getOnClickDate(year, month, day) {
    if (year && month && day) {
      this.props.onClick(`${year}-${month}-${day}`);
    }
    return false;
  }

  // 跳转到到前一个月或后一个月
  getMonth(type: string) {
    const m = { 'pre': -1, 'next': 1 }[type];
    let nextMonth = this.state.selectMonth + m;
    let nextYear = this.state.selectYear;
    if (nextMonth === 0) {
      nextMonth = 12;
      nextYear -= 1;
    } else if (nextMonth === 13) {
      nextMonth = nextMonth % 12;
      nextYear += 1;
    }
    this.setState({
      selectYear: nextYear,
      selectMonth: nextMonth,
    });
    this.props.onChange(nextYear, nextMonth);
  }

  // 转换年份
  changeYear(value: number) {
    this.props.onChange(value, this.state.selectMonth);
    this.setState({
      selectYear: value,
    });
  }

  // 渲染页面
  render() {
    const { width, height, onSelectDays, disabledDays, disabledDates } = this.props;
    const { selectYear, selectMonth, selectDay } = this.state;

        // 计算当前选中月有多少天
    const selectDays = new Date(selectYear, selectMonth, 0).getDate();
    // const selectDays = 31;
    const curMonthDays = [];
    for (let i = 1; i <= selectDays; i++) {
      curMonthDays.push(i);
    }

    // 计算当前选中月的1号是周几
    const weekIndex = moment(`${selectYear}/${selectMonth}/1`).format('d');
    //  计算当前选中月的上个月最后一天是几号 需要上个月的几天
    const preMonthDay = [];
    if (weekIndex !== 0) {
      let lastMonth = selectMonth - 1;
      let lastYear = selectYear;
      if (lastMonth === 0) {
        lastMonth = 12;
        lastYear -= 1;
      }
      const lastDay = new Date(lastYear, lastMonth, 0).getDate();
      for (let i = (weekIndex - 1); i >= 0; i --) {
        preMonthDay.push(lastDay - i);
      }
    }
        // 计算需要下个月的几天
    const nextMonthDay = [];
    for (let i = 1; i <= (35 - selectDays - weekIndex); i ++) {
      nextMonthDay.push(i);
    }
        // 合并所有需要显示的日期
    const allDays = preMonthDay.concat(curMonthDays, nextMonthDay);

        // 渲染日期
    const getDay = (i) => {
      const view = [];
      const colNum = i * COLNUMBER;
      const thisTime = Number(selectDays) + Number(weekIndex);
      const time = `${currentYear}-${currentMonth}-${currentDay}`;
      for (let j = (i - 1) * COLNUMBER; j < colNum; j++) {
        const currentTime1 = `${selectYear}/${selectMonth}/${allDays[j]}`;
        const currentTime2 = `${selectYear}-${selectMonth}-${allDays[j]}`;
        const timeStamp = moment(currentTime1).format('x');
        const isDisable = disabledDays.indexOf(j % 7) !== -1 ? true : false;
        let todayStyle = '';
        let text = '';
         // 1 先判断今天的状态
         // j < weekIndex  是上个月的日期
         // j >= (Number(selectDays) + Number(weekIndex))  是下个月的日期
        if (j > weekIndex && j < thisTime && currentTime2 === time) {
          text = currentDay;
          if (isDisable || disabledDates > timeStamp) {
            // 判断不可选的
            todayStyle = styles.disabledToday;
          } else if (onSelectDays.indexOf(currentTime2) !== -1) {
            // 判断已被选的
            todayStyle = styles.onSelectToDay;
          } else {
            todayStyle = styles.todayStyle;
          }
        } else {
          text = allDays[j];
          if (j < weekIndex || j >= thisTime || isDisable || disabledDates > timeStamp) {
            todayStyle = styles.disableDay;
          } else {
            if (onSelectDays.indexOf(currentTime2) !== -1) {
              todayStyle = styles.onSelectDay;
            } else {
              todayStyle = styles.dayStyles;
            }
          }
        }
        view.push(
              <span
                key={j}
                className={todayStyle}
                onClick={() => {
                  if (todayStyle !== styles.disabledToday && todayStyle !== styles.disableDay) {
                    this.getOnClickDate(selectYear, selectMonth, allDays[j]);
                  }
                }}
              >
                {text}
              </span>
            );
      }
      return view;
    };

        // 显示选中月的日期
    const showDays = () => {
      const view = [];
      for (let i = 1; i <= ROWNUMBER; i++) {
        view.push(
                <div className={styles.cBodyHeader1} key={i}>
                  {getDay(i)}
                </div>
              );
      }
      return view;
    };

    const years = [];
    for (let i = currentYear; i > 2000; i--) {
      years.push(i);
    }
    const titleYears = () => {
      const view = [];
      years.map((year, i) => view.push(<option key={i} value={year}>{year}</option>));
      return view;
    };
    return (
          <div
            className={styles.calendar}
            style={{ width: `${width}`, height: `${height}` }}
          >
            <div className={styles.calendarHeader}>
              <div className={styles.headerTitle}>
                <div>
                  <div>
                  <select defaultValue={selectYear}
                    className={styles.selectYearStyle}
                    onChange={(e) => {this.changeYear(e.target.value);}}
                  >
                  {titleYears()}
                  </select>年{selectMonth}月{selectDay}日</div>
                  <div style={{ fontSize: '4vw', marginLeft: '2vw' }}>{currentTime}</div>
                </div>
                <div className={styles.iconStyle}>
                  <div className={styles.iconLeft} onClick={() => this.getMonth('pre')} />
                  <div className={styles.iconRight} onClick={() => this.getMonth('next')} />
                </div>
              </div>
              <div className={styles.cBodyHeader}>
                <span>日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span>六</span>
              </div>
            </div>
            <div className={styles.calendarBody}>
              {showDays()}
            </div>
        </div>
    );
  }
}

export default Calendar;
