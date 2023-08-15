"use client"
import UpdateDeck from "@/screens/DeckPage/update"

export default function DeckUpdatePage(url) {
    const { id } = url.params;
    return (
        <>
            <UpdateDeck id={id}/>
        </>
    )
}
