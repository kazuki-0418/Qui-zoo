import { Button, Card } from 'flowbite-react';
import { ParticipantList } from './ParticipantList';
import { AvatarIcon } from '@/components/ui/AvatarIcon';

interface Participant {
    id: string;
    name: string;
    isHost: boolean;
}

interface WaitingRoomProps {
    roomNumber: string;
    participants: Participant[];
    isHost: boolean;
    onStartQuiz: () => void;
}

// TODO username avatar 

export const WaitingRoom = ({
    roomNumber,
    participants,
    isHost,
    onStartQuiz,
}: WaitingRoomProps) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Waiting Room</h2>
                    <p className="text-gray-600">Room Number: {roomNumber}</p>
                </div>
                {isHost && (
                    <>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Participant List</h3>
                            <ParticipantList participants={participants} />
                        </div>
                        <div className="flex justify-center">
                            <Button
                                color="blue"
                                size="lg"
                                onClick={onStartQuiz}
                                disabled={participants.length < 2}
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </>
                )}
                {!isHost && (
                    <div className="text-center text-gray-600">
                        <AvatarIcon image="penguin-1" />
                        <div className="my-2">Your Name</div>
                        Please wait for the host to start the quiz...
                    </div>
                )}
            </Card>
        </div>
    );
}; 