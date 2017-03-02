'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var Immutable = _interopRequireWildcard(_immutable);

var _styles = require('./styles/styles.css');

var styles = _interopRequireWildcard(_styles);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ROWNUMBER = 5;
var COLNUMBER = 7;
var currentYear = (0, _moment2.default)().year();
var currentMonth = (0, _moment2.default)().month() + 1;
var currentDay = (0, _moment2.default)().dates();
var currentTime = (0, _moment2.default)().format('h:mm A');

/**
 * @width 日历宽度
 * @height 日历高度
 * @onSelectDays 选中的日期  数组[string, string]
 * @disabledDays 不可选时间  ［number, number］ 不可选周几
 * @disabledDates 不可选时间范围 number  时间戳
 * @min 最小可选日期
 * @max 最大可选日期
 */

var Calendar = function (_React$Component) {
  _inherits(Calendar, _React$Component);

  function Calendar(props) {
    _classCallCheck(this, Calendar);

    var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

    _this.state = {
      selectYear: currentYear,
      selectMonth: currentMonth,
      selectDay: currentDay
    };
    return _this;
  }

  _createClass(Calendar, [{
    key: 'getOnClickDate',
    value: function getOnClickDate(year, month, day) {
      if (year && month && day) {
        this.props.onClick(year + '-' + month + '-' + day);
      }
      return false;
    }

    // 跳转到到前一个月或后一个月

  }, {
    key: 'getMonth',
    value: function getMonth(type) {
      var m = { 'pre': -1, 'next': 1 }[type];
      var nextMonth = this.state.selectMonth + m;
      var nextYear = this.state.selectYear;
      if (nextMonth === 0) {
        nextMonth = 12;
        nextYear -= 1;
      } else if (nextMonth === 13) {
        nextMonth = nextMonth % 12;
        nextYear += 1;
      }
      this.setState({
        selectYear: nextYear,
        selectMonth: nextMonth
      });
      this.props.onChange(nextYear, nextMonth);
    }

    // 转换年份

  }, {
    key: 'changeYear',
    value: function changeYear(value) {
      this.props.onChange(value, this.state.selectMonth);
      this.setState({
        selectYear: value
      });
    }

    // 渲染页面

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height,
          onSelectDays = _props.onSelectDays,
          disabledDays = _props.disabledDays,
          disabledDates = _props.disabledDates;
      var _state = this.state,
          selectYear = _state.selectYear,
          selectMonth = _state.selectMonth,
          selectDay = _state.selectDay;

      // 计算当前选中月有多少天

      var selectDays = new Date(selectYear, selectMonth, 0).getDate();
      // const selectDays = 31;
      var curMonthDays = [];
      for (var i = 1; i <= selectDays; i++) {
        curMonthDays.push(i);
      }

      // 计算当前选中月的1号是周几
      var weekIndex = (0, _moment2.default)(selectYear + '/' + selectMonth + '/1').format('d');
      //  计算当前选中月的上个月最后一天是几号 需要上个月的几天
      var preMonthDay = [];
      if (weekIndex !== 0) {
        var lastMonth = selectMonth - 1;
        var lastYear = selectYear;
        if (lastMonth === 0) {
          lastMonth = 12;
          lastYear -= 1;
        }
        var lastDay = new Date(lastYear, lastMonth, 0).getDate();
        for (var _i = weekIndex - 1; _i >= 0; _i--) {
          preMonthDay.push(lastDay - _i);
        }
      }
      // 计算需要下个月的几天
      var nextMonthDay = [];
      for (var _i2 = 1; _i2 <= 35 - selectDays - weekIndex; _i2++) {
        nextMonthDay.push(_i2);
      }
      // 合并所有需要显示的日期
      var allDays = preMonthDay.concat(curMonthDays, nextMonthDay);

      // 渲染日期
      var getDay = function getDay(i) {
        var view = [];
        var colNum = i * COLNUMBER;
        var thisTime = Number(selectDays) + Number(weekIndex);
        var time = currentYear + '-' + currentMonth + '-' + currentDay;

        var _loop = function _loop(j) {
          var currentTime1 = selectYear + '/' + selectMonth + '/' + allDays[j];
          var currentTime2 = selectYear + '-' + selectMonth + '-' + allDays[j];
          var timeStamp = (0, _moment2.default)(currentTime1).format('x');
          var isDisable = disabledDays.indexOf(j % 7) !== -1 ? true : false;
          var todayStyle = '';
          var text = '';
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
          view.push(_react2.default.createElement(
            'span',
            {
              key: j,
              className: todayStyle,
              onClick: function onClick() {
                if (todayStyle !== styles.disabledToday && todayStyle !== styles.disableDay) {
                  _this2.getOnClickDate(selectYear, selectMonth, allDays[j]);
                }
              }
            },
            text
          ));
        };

        for (var j = (i - 1) * COLNUMBER; j < colNum; j++) {
          _loop(j);
        }
        return view;
      };

      // 显示选中月的日期
      var showDays = function showDays() {
        var view = [];
        for (var _i3 = 1; _i3 <= ROWNUMBER; _i3++) {
          view.push(_react2.default.createElement(
            'div',
            { className: styles.cBodyHeader1, key: _i3 },
            getDay(_i3)
          ));
        }
        return view;
      };

      var years = [];
      for (var _i4 = currentYear; _i4 > 2000; _i4--) {
        years.push(_i4);
      }
      var titleYears = function titleYears() {
        var view = [];
        years.map(function (year, i) {
          return view.push(_react2.default.createElement(
            'option',
            { key: i, value: year },
            year
          ));
        });
        return view;
      };
      return _react2.default.createElement(
        'div',
        {
          className: styles.calendar,
          style: { width: '' + width, height: '' + height }
        },
        _react2.default.createElement(
          'div',
          { className: styles.calendarHeader },
          _react2.default.createElement(
            'div',
            { className: styles.headerTitle },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'select',
                  { defaultValue: selectYear,
                    className: styles.selectYearStyle,
                    onChange: function onChange(e) {
                      _this2.changeYear(e.target.value);
                    }
                  },
                  titleYears()
                ),
                '\u5E74',
                selectMonth,
                '\u6708',
                selectDay,
                '\u65E5'
              ),
              _react2.default.createElement(
                'div',
                { style: { fontSize: '4vw', marginLeft: '2vw' } },
                currentTime
              )
            ),
            _react2.default.createElement(
              'div',
              { className: styles.iconStyle },
              _react2.default.createElement('div', { className: styles.iconLeft, onClick: function onClick() {
                  return _this2.getMonth('pre');
                } }),
              _react2.default.createElement('div', { className: styles.iconRight, onClick: function onClick() {
                  return _this2.getMonth('next');
                } })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: styles.cBodyHeader },
            _react2.default.createElement(
              'span',
              null,
              '\u65E5'
            ),
            _react2.default.createElement(
              'span',
              null,
              '\u4E00'
            ),
            _react2.default.createElement(
              'span',
              null,
              '\u4E8C'
            ),
            _react2.default.createElement(
              'span',
              null,
              '\u4E09'
            ),
            _react2.default.createElement(
              'span',
              null,
              '\u56DB'
            ),
            _react2.default.createElement(
              'span',
              null,
              '\u4E94'
            ),
            _react2.default.createElement(
              'span',
              null,
              '\u516D'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: styles.calendarBody },
          showDays()
        )
      );
    }
  }]);

  return Calendar;
}(_react2.default.Component);

Calendar.defaultProps = {
  width: document.body.clientWidth,
  height: document.body.clientWidth,
  onSelectDays: [],
  disabledDays: [],
  disabledDates: 0,
  // min: PropTypes.array,
  // max: PropTypes.array,
  onClick: _react.PropTypes.func
};
Calendar.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  onSelectDays: _react.PropTypes.array,
  disabledDays: _react.PropTypes.array,
  disabledDates: _react.PropTypes.number,
  onClick: _react.PropTypes.func,
  onChange: _react.PropTypes.func
};
exports.default = Calendar;
module.exports = exports['default'];