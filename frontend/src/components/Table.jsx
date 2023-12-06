import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import LeadModal from "./LeadModal";

const Table = () => {
  const [token] = useContext(UserContext);
  const [leads, setLeads] = useState(null);
  const [errorMessage, setErorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModel, setActiveModel] = useState(false);
  const [id, setId] = useState(null);
  const handleUpdate = async (id) => {
    setId(id);
    setActiveModel(true);
  };
  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/leads/${id}`, requestOptions);
    if (!response.ok) {
      setErorMessage("Failed to delete lead");
    }
    getLeads();
  };

  const getLeads = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/leads", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      setErorMessage("Something went wrong/ Couldn't load the leads");
    } else {
      setLeads(data);
      setLoaded(true);
    }
  };
  useEffect(() => {
    getLeads();
  }, []);
  const handleModal = () => {
    setActiveModel(!activeModel);
    getLeads();
    setId(null);
  };
  return (
    <>
      <LeadModal
        active={activeModel}
        handleModal={handleModal}
        id={id}
        token={token}
        setErrorMessage={setErorMessage}
      />
      <button
        className="button is-fullwidth mb-5 is-primary "
        onClick={() => setActiveModel(true)}
      >
        Create Lead
      </button>
      <ErrorMessage message={errorMessage} />
      {loaded && leads ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Note</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.first_name}</td>
                <td>{lead.last_name}</td>
                <td>{lead.company}</td>
                <td>{lead.email}</td>
                <td>{lead.note}</td>
                <td>{moment(lead.date_last_updated).format("MMM Do YY")}</td>
                <td>
                  <button
                    className="button mr-2 is-info is-light"
                    onClick={() => handleUpdate(lead.id)}
                  >
                    Update
                  </button>
                  <button
                    className="button mr-2 is-danger is-light"
                    onClick={() => handleDelete(lead.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default Table;
