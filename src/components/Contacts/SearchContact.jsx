// import { PURPLE } from "../../helpers/Colors"
import { useContext } from 'react';
import { ContactContext } from './../../context/contactContext';

const SearchContact = () => {
    const { contactSearch } = useContext(ContactContext)

    return (
        <div className="input-group mx-2 w-75" dir="ltr">
            {/* <span className="input-group-text" id="basic-addon1" style={{ backgroundColor: PURPLE }}>
                <i className="fas fa-search"></i>
            </span> */}
            <input type="text" dir="rtl" onChange={event => contactSearch(event.target.value)} className="form-control" placeholder="جستجو..." />
        </div>
    )
}

export default SearchContact;