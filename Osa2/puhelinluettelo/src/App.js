import React, {useState, useEffect} from 'react';
import personService from './services/person'
import './styles.css'

const Filter = ({filter, setFilter}) => {
    return <>
        Filter shown with <input value={filter} onChange={(e) => setFilter(e.currentTarget.value)}/>
    </>
}

const PersonFrom = ({newName, setNewName, addPerson, newNumber, setNewNumber }) => {

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

const Persons = ({persons,  removePerson}) => {
    return <ul>
        {persons.map(person => (
                <li key={person.id}>{person.name} {person.number} <button onClick={() => removePerson(person.id)}>delete</button></li>
            )
        )}
    </ul>
}

const Notification = ({msg, style}) => {
    return <div id="notification" className={style}>{msg}</div>
}

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        personService.getAll()
            .then( all => {
                setPersons(all)
            })
    },[])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState(null)

    const filteredPersons = persons.filter( person => {
        const name = person.name.toLowerCase()
        return name.includes(filter.toLowerCase())

    })

    const addPerson = e => {
        e.preventDefault()

        const sameNamed = persons.filter( person => person.name.toLowerCase() === newName.toLowerCase()).length > 0

        if (sameNamed) {
            const oldId = persons.filter( person => person.name.toLowerCase() === newName.toLowerCase())[0].id
            personService.update(oldId, {name: newName, number: newNumber})
                .then( modifiedPerson => {
                    setPersons( persons.map( person => {
                        return person.id !== modifiedPerson.id ? person : modifiedPerson

                    }))
                    showNotification("success", `Edited ${newName}`)
                })
            return
        }
        personService.create({name: newName, number: newNumber})
            .then( created => {
                setPersons([...persons, created ])
                showNotification("success", `Added ${newName}`)
            })
            .catch( error => {
            showNotification("error", JSON.stringify(error.response.data))
        })
    }

    const removePerson = id => {
        const name = persons.filter( person => person.id === id)[0].name
        if ( window.confirm(`Delete ${name} ?`) ) {
            personService.remove(id)
                .then( () => {
                        setPersons(persons.filter( person => person.id !== id))
                        showNotification("success", `Deleted ${name}`)
                })
                .catch( ( error ) => {
                    if (error.response.status === 404) {
                        showNotification("error", `Information of ${name} has already been removed from server`)
                    }
                })

        }

    }

    const showNotification = (style, msg) => {
        setNotification({ style, msg })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    return (
        <div>
            <h2>Phonebook</h2>
            { notification ? <Notification style={notification.style} msg={notification.msg}/> : null }
            <Filter filter={filter} setFilter={setFilter}/>
            <h2>Add a new</h2>
            <PersonFrom
                newName={newName}
                setNewName={setNewName}
                newNumber={newNumber}
                setNewNumber={setNewNumber}

                addPerson={addPerson}/>
            <h2>Numbers</h2>
            <Persons persons={filteredPersons} removePerson={removePerson}/>
        </div>
    )

}

export default App