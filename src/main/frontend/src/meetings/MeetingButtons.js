export default function MeetingButtons({username, meeting : {participants }, onDelete, onSignOut, onSignIn}) {
    const isAttending = participants.includes(username);
    const isEmpty = participants.length === 0;

    return <>
        {
            isAttending
                ? <button onClick={onSignOut}>Wypisz się</button>
                : <button onClick={onSignIn}>Zapisz się</button>
        }
        {isEmpty && <button onClick={onDelete} className="button-outline">Usuń puste spotkanie</button>}
    </>
        ;
}
