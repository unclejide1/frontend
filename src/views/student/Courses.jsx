import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";
import useAxios from "../../utils/useAxios";
import { userId } from "../../utils/constants";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [fetchingCourse, setFetchingCourse] = useState(true);

  const fetchCourseData = () => {
    useAxios()
      .get(`student/course-list/${userId}/`)
      .then((res) => {
        setCourses(res.data);
        setFetchingCourse(false);
      });
  };

  useEffect(() => {
    fetchCourseData();
    console.log(fetchingCourse);
  }, []);

  const handleSearchCourse = (event) => {
    const query = event.target.value.toLowerCase();
    console.log(query);
    if (query === "") {
      fetchCourseData();
    } else {
      const filtered = courses.filter((course) => {
        return course.course.title.toLowerCase().includes(query);
      });
      setCourses(filtered);
    }
  };
  console.log(courses);

  return (
    <>
      <BaseHeader />

      <section className="pt-5 pb-5">
        <div className="container">
          {/* Header Here */}
          <Header />
          <div className="row mt-0 mt-md-4">
            {/* Sidebar Here */}
            <Sidebar />
            <div className="col-lg-9 col-md-8 col-12">
              <h4 className="mb-0 mb-4">
                {" "}
                <i className="fas fa-shopping-cart"></i> My Courses
              </h4>

              <div className="card mb-4">
                <div className="card-header">
                  <h3 className="mb-0">Courses</h3>
                  <span>
                    Start watching courses now from your dashboard page.
                  </span>
                </div>
                <div className="card-body">
                  <form className="row gx-3">
                    <div className="col-lg-12 col-md-12 col-12 mb-lg-0 mb-2">
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search Your Courses"
                        onChange={handleSearchCourse}
                      />
                    </div>
                  </form>
                </div>
                {fetchingCourse === false && (
                  <div className="table-responsive overflow-y-hidden">
                    <table className="table mb-0 text-nowrap table-hover table-centered text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Courses</th>
                          <th>Enrolled</th>
                          <th>Lectures</th>
                          <th>Completed</th>
                          <th>Progress</th>
                          <th>Action</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {courses?.map((c, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <a href="#">
                                    <img
                                      src={c.course?.image}
                                      alt="course"
                                      className="rounded img-4by3-lg"
                                      style={{
                                        width: "100px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </a>
                                </div>
                                <div className="ms-3">
                                  <h4 className="mb-1 h5">
                                    <a
                                      href="#"
                                      className="text-inherit text-decoration-none text-dark"
                                    >
                                      {c.course?.title}
                                    </a>
                                  </h4>
                                  <ul className="list-inline fs-6 mb-0">
                                    <li className="list-inline-item">
                                      <i className="bi bi-reception-4"></i>
                                      <span className="ms-1">
                                        {c.course?.level}
                                      </span>
                                    </li>
                                    <li className="list-inline-item">
                                      <i className="bi bi-mic"></i>
                                      <span className="ms-1">
                                        {c.course?.language}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="mt-3">
                                {moment(c.date).format("MMM DD, YYYY")}
                              </p>
                            </td>
                            <td>
                              <p className="mt-3">{c.lectures?.length}</p>
                            </td>
                            <td>
                              <p className="mt-3">
                                {c.completed_lesson?.length}
                              </p>
                            </td>
                            <td>
                              <p className="mt-3">
                                {(
                                  (c.completed_lesson?.length /
                                    c.lectures?.length) *
                                  100
                                ).toFixed(0)}
                                %
                              </p>
                            </td>
                            <td>
                              {c.completed_lesson?.length > 0 ? (
                                <Link
                                  to={`/student/courses/${c.enrollment_id}/`}
                                  className="btn btn-primary btn-sm mt-3"
                                >
                                  Continue{" "}
                                  <i className="fas fa-arrow-right"></i>
                                </Link>
                              ) : (
                                <Link
                                  to={`/student/courses/${c.enrollment_id}/`}
                                  className="btn btn-success btn-sm mt-3"
                                >
                                  Start <i className="fas fa-arrow-right"></i>
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {fetchingCourse === true && 
                    <p className="mt-2 p-4">Loading... <i className="fas fa-spinner fa-spin"></i></p>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default Courses;
