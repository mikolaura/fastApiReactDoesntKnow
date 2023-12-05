import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";

const Table = () => {
  const [token] = useContext(UserContext);
  const [leads, setLeads] = useState(null);
  const [errorMessage, setErorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModel, setActiveModel] = useState(false);
  const [id, setId] = useState(null);
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
  return (
    <>
      <button className="button is-fullwidth mb-5 is-primary ">
        Create Lead
      </button>
      <ErrorMessage message={errorMessage} />
      {loaded && leads ? <table className="table is-fullwidth">
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
                {leads.map(lead => (
                    <tr key={lead.id}>
                        <td>{lead.first_name}</td>
                        <td>{lead.last_name}</td>
                        <td>{lead.company}</td>
                        <td>{lead.email}</td>
                        <td>{lead.note}</td>
                        <td>{lead.date_last_updated}</td>
                        <td>{lead.note}</td>
                    </tr>
                ))}
            </tbody>
      </table> : <p>Loading</p>}
    </>
  );
};

export default Table;
