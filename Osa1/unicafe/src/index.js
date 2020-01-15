import React, { useState } from 'react';
import ReactDOM from 'react-dom'

const StatisticLine = ({text, value}) => {
    return <tr><td>{text}</td><td>{value}</td></tr>
}

const Statisctics = ({good, neutral, bad}) => {

    const all = good + neutral + bad
    const average = (good - bad) / all
    const positives = good / all * 100 + "%"

    return <>
        <h2>Statistics</h2>
        {
            all > 0 ? <table>
                <tbody>
                <StatisticLine text="Good" value={good}/>
                <StatisticLine text="Neutral" value={neutral}/>
                <StatisticLine text="Bad" value={bad}/>
                <StatisticLine text="Average" value={average}/>
                <StatisticLine text="Positive" value={positives}/>
                </tbody>
            </table> : <p>No feedback given</p>
        }

    </>

}

const Button = (props) => {
    return <button {...props}/>
}

const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)



    return (
        <div>
            <h2>Give feedback</h2>
            <Button onClick={() => setGood(good + 1)}>good</Button>
            <Button onClick={() => setNeutral(neutral + 1)}>neutral</Button>
            <Button onClick={() => setBad(bad + 1)}>bad</Button>
            <Statisctics good={good} neutral={neutral} bad={bad}/>
        </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)