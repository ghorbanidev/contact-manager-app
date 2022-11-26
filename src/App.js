import "./App.css";
import { AddContact, EditContact, ViewContact, Contacts, Navbar } from "./components";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { getAllContacts, getAllGroups, createContact, deleteContact } from "./services/contactService"
import { confirmAlert } from "react-confirm-alert";
import { COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW } from "./helpers/Colors";
import { ContactContext } from "./context/contactContext";
import _ from "lodash"
import { useImmer } from "use-immer";
import { toast, ToastContainer } from "react-toastify";

const App = () => {

  const [loading, setLoading] = useImmer(false)
  const [contacts, setContacts] = useImmer([])
  const [groups, setGroups] = useImmer([])
  const [filteredContacts, setFilteredContacts] = useImmer([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: contactsData } = await getAllContacts()
        const { data: groupsData } = await getAllGroups()
        setContacts(contactsData)
        setFilteredContacts(contactsData)
        setGroups(groupsData)
        setLoading(false)
      } catch (err) {
        console.log(err.message);
        setLoading(false)
      }
    }
    fetchData()
  }, [])



  const createContactForm = async (values) => {
    try {
      setLoading(draft => !draft)
      const { status, data } = await createContact(values)

      if (status === 201) {
        toast.success("مخاطب با موفقیت افزوده شد")
        setContacts(draft => { draft.push(data) })
        setFilteredContacts(draft => { draft.push(data) })
        setLoading(prevLoading => !prevLoading)
        navigate("/contacts")
      }
    } catch (err) {
      console.log(err.message);
      setLoading(prevLoading => !prevLoading)
    }
  }


  const confirmDelete = (contactId, contactFullName) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div dir="rtl" className="p-4" style={{ backgroundColor: CURRENTLINE, border: `1px solid ${PURPLE}`, borderRadius: "1em" }}>
            <h1 style={{ color: YELLOW }}>پاک کردن مخاطب</h1>
            <p styles={{ color: FOREGROUND }}>
              مطمعنی که میخوای مخاطب {contactFullName} را پاک کنی؟
            </p>
            <button onClick={() => {
              removeContact(contactId)
              onClose()
            }}
              className="btn mx-2"
              style={{ backgroundColor: PURPLE }}
            >
              مطمعن هستم
            </button>
            <button onClick={onClose} className="btn" style={{ backgroundColor: COMMENT }}>
              انصراف
            </button>
          </div>
        )
      }
    })
  }

  const removeContact = async (contactId) => {
    const contactsBackup = [...contacts]
    try {
      setLoading(true)
      setContacts(draft => draft.filter(c => c.id !== contactId))
      setFilteredContacts(draft => draft.filter(c => c.id !== contactId))
      setLoading(false)
      const { status } = await deleteContact(contactId)
      toast.error("مخاطب با موفقیت حذف شد")
      if (status !== 200) {
        setContacts(contactsBackup)
        setFilteredContacts(contactsBackup)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
      setContacts(contactsBackup)
      setFilteredContacts(contactsBackup)
      setLoading(false)
    }
  }


  const contactSearch = _.debounce(query => {
    if (!query) return setFilteredContacts([...contacts])
    setFilteredContacts(draft => draft.filter(c => c.fullname.toLowerCase().includes(query.toLowerCase())))
  }, 1000)


  return (
    <ContactContext.Provider value={{
      loading,
      setLoading,
      contacts,
      setContacts,
      filteredContacts,
      setFilteredContacts,
      groups,
      deleteContact: confirmDelete,
      createContact: createContactForm,
      contactSearch
    }}>
      <div className="App">
        <ToastContainer rtl={true} position="top-right" theme="colored" />
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Navigate to={'/contacts'} />} />
          <Route path={"/contacts"} element={<Contacts />} />
          <Route path={"/contacts/add"} element={<AddContact />} />
          <Route path={"/contacts/:contactId"} element={<ViewContact />} />
          <Route path={"/contacts/edit/:contactId"} element={<EditContact />} />
        </Routes>
      </div>
    </ContactContext.Provider>
  );
};

export default App;
