import React, { useState, useEffect } from 'react';

export default function CommentsComponent({ itemId }) {
  const [comments, setComments] = useState([]); // List of chat messages
  const [newComment, setNewComment] = useState(''); // New comment input
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track which comment is being edited
  const [editComment, setEditComment] = useState(''); // For editing comments

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await fetch(`${apiUrl}/api/catalog_items/${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data.conversation || []); // Load the conversation if available
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [itemId]);

  // Handle sending a new comment
  const handleSendComment = async () => {
    if (newComment.trim() === '') return;

    const newMessage = {
      message: newComment,
      timestamp: new Date().toISOString(),
    };

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Add new comment to the existing conversation array
      const updatedConversation = [...comments, newMessage];

      // Send PATCH request to update the conversation field
      const response = await fetch(`${apiUrl}/api/catalog_items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ conversation: updatedConversation }),
      });

      if (!response.ok) {
        throw new Error('Failed to send comment');
      }

      // Update the local state with the new comment
      setComments(updatedConversation);
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (index) => {
    const updatedConversation = comments.filter((_, i) => i !== index);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Send PATCH request to update the conversation field
      await fetch(`${apiUrl}/api/catalog_items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ conversation: updatedConversation }),
      });

      setComments(updatedConversation);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Handle edit comment
  const handleEditComment = async (index) => {
    if (editComment.trim() === '') return;

    const updatedConversation = comments.map((comment, i) =>
      i === index ? { ...comment, message: editComment } : comment
    );

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Send PATCH request to update the conversation field
      await fetch(`${apiUrl}/api/catalog_items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ conversation: updatedConversation }),
      });

      setComments(updatedConversation);
      setEditingIndex(null); // Exit edit mode
      setEditComment(''); // Clear the edit input
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  // Handle Enter key for submitting a new comment
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Prevent default action when only Enter is pressed
      handleSendComment();  // Send the comment
    }
  };

  // Format the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day} at ${time}`;
  };

  return (
    <div className="mt-2">
      {/* Only render comments section if there are comments */}
      {comments.length > 0 && (
        <div className="border rounded p-2 max-h-60 overflow-y-auto">
          {comments.map((comment, index) => (
            <div key={index} className="mb-2 p-2 rounded-lg bg-gray-200">
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="border rounded p-1 w-full"
                  />
                  <button
                    className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEditComment(index)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm">{comment.message}</p>
                  <p className="text-xs text-gray-500">{formatTime(comment.timestamp)}</p>
                  <div className="text-xs text-gray-500 flex justify-end space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setEditingIndex(index);
                        setEditComment(comment.message);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteComment(index)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex">
        <input
          type="text"
          className="flex-grow border rounded p-1 text-sm"
          value={newComment}
          // onChange={(e) => setNewComment(e.target.value)}
          // onKeyPress={handleKeyPress} // Handle Enter key press
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
          // onClick={handleSendComment}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
