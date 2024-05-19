import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";
import Loading from "./Loading";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                setMeetings(meetings);
            }
        };

        fetchMeetings();
    }, []);

    async function handleNewMeeting(meeting) {
        setIsLoading(true)
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const reposnseMeeting = await response.json()
            const nextMeetings = [...meetings, reposnseMeeting];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
        setIsLoading(false)
    }

    async function handleDeleteMeeting(meeting) {
        // const nextMeetings = meetings.filter(m => m !== meeting);
        // setMeetings(nextMeetings);
        setIsLoading(true)
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
        setIsLoading(false)
    }

    async function handleSignIn(meeting) {
        setIsLoading(true)
        const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login : username
            }),

        });
        if (response.ok){
            const nextMeetings = meetings.map(m => {
                if (m === meeting) {
                    m.participants = [...m.participants, {"login" : username}];
                }
                return m;
            });
            setMeetings(nextMeetings);
        }
        setIsLoading(false)
    }

    function handleSignOut(meeting) {
        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                m.participants = m.participants.filter(u => u.login !== username);
            }
            return m;
        });
        setMeetings(nextMeetings);
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {
                        addingNewMeeting
                            ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                            : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
                    }
                    {meetings.length > 0 &&
                        <MeetingsList meetings={meetings} username={username}
                                      onDelete={handleDeleteMeeting}
                                      onSignIn={handleSignIn}
                                      onSignOut={handleSignOut}/>}
                </>
            )}

        </div>
    )
}
