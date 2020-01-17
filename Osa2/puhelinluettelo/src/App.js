import React, {useState, useEffect} from 'react';
import axios from 'axios'

const Filter = ({filter, setFilter}) => {
    return <>
        Filter shown with <input value={filter} onChange={(e) => setFilter(e.currentTarget.value)}/>
    </>
}

const PersonFrom = ({newName, setNewName, addPerson, newNumber, setNewNumber}) => {

    return <form>
        <div>
            name: <input value={newName} onChange={(e) => setNewName(e.currentTarget.value)}/><br/>
            number: <input value={newNumber} onChange={(e) => setNewNumber(e.currentTarget.value)}/><br/>
        </div>
        <div>
            <button onClick={addPerson} type="submit">add</button>
        </div>
    </form>
}

const Persons = ({persons}) => {
    return <ul>
        {persons.map(person => (
                <li>{person.name} {person.number}</li>
            )
        )}
    </ul>
}

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        axios.get( "http://localhost:3001/persons")
            .then( response => {
                setPersons(response.data)
            })
    })

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    const filteredPersons = persons.filter( person => {
        const name = person.name.toLowerCase()
        return name.includes(filter.toLowerCase())

    })

    const addPerson = (e) => {
        e.preventDefault()
        const sameNamed = persons.filter( person => person.name.toLowerCase() === newName.toLowerCase()).length > 0

        if (sameNamed) {
            alert(`${newName} is already added to phonebook`)
            return
        }
        setPersons([...persons, {name: newName, number: newNumber}])
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} setFilter={setFilter}/>
            <h2>Add a new</h2>
            <PersonFrom
                newName={newName}
                setNewName={setNewName}
                newNumber={newNumber}
                setNewNumber={setNewNumber}
                addPerson={addPerson}/>
            <h2>Numbers</h2>
            <Persons persons={filteredPersons}/>
        </div>
    )

}

export default App