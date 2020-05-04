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
    this.refreshCourse = this.refreshCourse.bind(this);
    this.refreshTopics = this.refreshTopics.bind(this);
    this.refreshTopic = this.refreshTopic.bind(this);
    this.refreshStudents = this.refreshStudents.bind(this);
    this.refreshDetails = this.refreshDetails.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  throwError(code) {
    if (code !== ErrStates.Offline) this.setState({ err: code });

    this.props.onError && this.props.onError();
  }

  async refreshStudents() {
    const { functions } = this.props;
    const course = this.state.course;

    if (course) {
      getProfileByStudents(functions, course).then(students =>
        this.setState({ students })
      );
    }
  }

  async refreshCourses(cb) {
    const { firestore, user } = this.props;
    const courses = await getCoursesByUser(firestore, user);
    const ret = typeof cb == "object" ? () => this.refreshForced(cb) : cb;
    this.setState({ courses }, ret);
  }

  async refreshCourse(params) {
    const { courses, course } = this.state;

    if (courses) {
      const _course = getReqById(courses.docs, course.id);
      this.setState({ course: _course }, () => this.refreshForced(params));
    }
  }

  async refreshTopics(cb) {
    const { firestore } = this.props;
    const course = this.state.course;
    const ret = typeof cb == "object" ? () => this.refreshForced(cb) : cb;

    if (course) {
      getTopicsByCourse(firestore, course).then(topics =>
        this.setState({ topics }, ret)
      );
    }
  }

  async refreshTopic() {
    const { topics, topic } = this.state;

    if (topic) {
      const _topic = getReqById(topics.docs, topic.id);
      this.setState({ topic: _topic });
    }
  }

  refreshDetails() {
    this.refreshTopics(this._refresh);
    this.refreshStudents();
  }

  refreshForced({ courses, course, students, topics, topic }) {
    courses && this.refreshCourses(courses);
    course && this.refreshCourse(course);
    topic && this.refreshTopic(topic);
    topics && this.refreshTopics(topics);
    students && this.refreshStudents();
  }

  refresh({ courseId, topicId, force }) {
    if (force) {
      this.refreshForced(force);
      return;
    }

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
      const _course = getReqById(courses.docs, lastReq.courseId);

      if (!_course) return this.throwError(ErrStates.CourseNull);

      differTopic = true;
      this.setState({ course: _course, topics: null }, this.refreshDetails);
    }

    if (!differTopic && requiresUpdate(topic, lastReq.topicId)) {
      const _topic = getReqById(topics.docs, lastReq.topicId);

      if (!_topic) return this.throwError(ErrStates.TopicNull);

      this.setState({ topic: _topic });
    }
  }

  componentDidMount() {
    this.refreshCourses(this._refresh);
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
