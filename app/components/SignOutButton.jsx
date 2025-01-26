'use client';

import { Logout } from "../logout/actions";

export default function SignOutButton() {

    return (
        <button
            onClick={() => Logout()} 
            type="submit"
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
        >
            Sign Out
        </button>
    )
}