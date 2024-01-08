import React, { useEffect, useState } from "react";
import "./style.css";
import AddEditUser from "./AddEditUser";
import { URL } from "./config";

const Board = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [selectedGroups, setSelectedGroups] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(URL);
      const newData = await response.json();
      setData(newData);
    };
    fetchData();
  }, []);

  const openUsermodal = () => {
    setIsModalOpen(true);
  };

  const closeUsermodal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const deleteStudentHandler = async (DataId) => {
    const response = await fetch(` http://localhost:3001/tableData/${DataId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const afterDeletingData = data.filter((val) => val.id !== DataId);
      setData(afterDeletingData);
    }
  };

  const handleCheckboxChange = (group) => {
    setSelectedGroups((prevSelected) =>
      prevSelected.includes(group)
        ? prevSelected.filter((selected) => selected !== group)
        : [...prevSelected, group]
    );
  };

  const filteredData = data.filter((student) => {
    const fields = Object.values(student).map((field) =>
      field.toString().toLowerCase()
    );

    const matchesSearch = fields.some((field) =>
      field.includes(filter.toLowerCase())
    );

    const matchesGroups =
      selectedGroups.length === 0 ||
      selectedGroups.some((selectedGroup) =>
        Array.isArray(student.groups)
          ? student.groups.includes(selectedGroup)
          : (student.groups || "").split(",").includes(selectedGroup)
      );
    console.log("matchesgroup", selectedGroups);
    return matchesSearch && matchesGroups;
  });

  const getHighlightedText = (text, highlight) => {
    if (typeof text !== "string") {
      return text;
    }

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: "yellow" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      <div className="top">
        <div>
          <h1 className="headings"> SAF </h1>
          <p style={{ fontSize: "12px", margin: "0px", paddingLeft: "2rem" }}>
            Student Administration FrameWork
          </p>
        </div>
        <div style={{ paddingRight: "3rem", marginTop: "3rem" }}>
          My Profile
        </div>
      </div>

      <button
        className="button"
        style={{ marginTop: "3rem", marginLeft: "5rem" }}
        onClick={openUsermodal}
      >
        ADD USER
      </button>

      <div className="footer">
        <div className="search">
          <p style={{ backgroundColor: "white" }}> SEARCH FOR NAME : </p>
          <div style={{ display: "flex" }}>
            <button className="search_button">
              <i class="material-icons" style={{ backgroundColor: "white" }}>
                search
              </i>
            </button>
            <input
              type="text"
              size="40"
              className="mytext"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="filter">
            <p style={{ backgroundColor: "white" }}> FILTER BY GROUP : </p>
            {["GroupA", "GroupB", "GroupC", "GroupD", "GroupE", "GroupF"].map(
              (group) => (
                <div key={group}>
                  <input
                    type="checkbox"
                    value={group}
                    checked={selectedGroups.includes(group)}
                    onChange={() => handleCheckboxChange(group)}
                  />
                  {group}
                </div>
              )
            )}
          </div>
        </div>

        <div className="table">
          <div>
            {/* <div style={{ margin: "10px" }}> */}
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Place</th>
              <th>Group</th>
              <th>Edit Data</th>
            </tr>
          </div>
          <div className="table_container">
            {filteredData.map((student, key) => {
              return (
                <tr key={key}>
                  <td>{getHighlightedText(student.id, filter)}</td>
                  <td>{getHighlightedText(student.name, filter)}</td>
                  <td>{getHighlightedText(student.gender, filter)}</td>
                  <td>{getHighlightedText(student.place, filter)}</td>
                  <td>{getHighlightedText(student.groups, filter)}</td>
                  <td>
                    <button
                      className="editbutton"
                      onClick={() => {
                        setSelectedStudent(student);
                        openUsermodal();
                      }}
                    >
                      UPDATE
                    </button>
                    <button
                      className="deletebutton"
                      onClick={() => deleteStudentHandler(student.id)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              );
            })}
            {isModalOpen && (
              <div>
                <AddEditUser
                  setData={setData}
                  selectedStudent={selectedStudent}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onClose={closeUsermodal}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
