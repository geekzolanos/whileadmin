import { Component } from "react";
import { getCoursesByUser, getTopicsByCourse, getProfileByStudents } from "api";
import PropTypes from "prop-types";

const ErrStates = { CourseNull: 1, TopicNull: 2 };

const getReqById = (stack, id) => stack.find(el => el.id === id);
const requiresUpdate = (it, id) => id && !(it && it.id === id);

class CourseProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: null,
      course: null,
      topics: null,
      topic: null,
      students: null,
      lastReq: [],
      err: null
    };

    this.throwError = this.throwError.bind(this);
    this.refreshCourses = this.refreshCourses.bind(this);
    this.refreshDetails = this.refreshDetails.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  throwError(code) {
    if (code !== ErrStates.Offline) this.setState({ err: code });

    this.props.onError && this.props.onError();
  }

  async refreshCourses() {
    const { firestore, user } = this.props;
    const courses = await getCoursesByUser(firestore, user);
    this.setState({ courses }, this._refresh);
  }

  refreshDetails() {
    const { firestore, functions } = this.props;
    const course = this.state.course;

    getTopicsByCourse(firestore, course).then(topics =>
      this.setState({ topics }, this._refresh)
    );

    getProfileByStudents(functions, course).then(students =>
      this.setState({ students })
    );
  }

  refresh({ courseId, topicId }) {
    let payload = { lastReq: { courseId, topicId } };

    if (courseId === null)
      payload.course = payload.students = payload.topics = null;

    if (topicId === null) payload.topic = null;

    this.setState(payload, this._refresh);
  }

  _refresh() {
    let differTopic = false;
    const { course, courses, topic, topics, lastReq } = this.state;

    // Request Differed by courses load
    if (!courses) return;

    if (requiresUpdate(course, lastReq.courseId)) {
      const _course = getReqById(courses, lastReq.courseId);

      if (!_course) return this.throwError(ErrStates.CourseNull);

      differTopic = true;
      this.setState({ course: _course, topics: null }, this.refreshDetails);
    }

    if (!differTopic && requiresUpdate(topic, lastReq.topicId)) {
      const _topic = getReqById(topics, lastReq.topicId);

      if (!_topic) return this.throwError(ErrStates.TopicNull);

      this.setState({ topic: _topic });
    }
  }

  componentDidMount() {
    this.refreshCourses();
  }

  componentWillUnmount() {
    this.setState({ courses: null });
  }

  render() {
    return this.props.children({
      errDismiss: () => this.setState({ err: null }),
      refresh: this.refresh,
      ...this.state
    });
  }
}

CourseProvider.propTypes = {
  firestore: PropTypes.any,
  functions: PropTypes.any,
  user: PropTypes.any,
  onError: PropTypes.func,
  children: PropTypes.func
};

export default CourseProvider;
