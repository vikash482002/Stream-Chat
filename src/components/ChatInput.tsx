import {
  ActionIcon,
  Box,
  FileButton,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { IconArrowRight, IconPaperclip } from '@tabler/icons-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { userContext, userSelectedFriendIdContext } from '../context/context'
import { db, storage } from '../libs/firebase'

/** Utility to get the file extension from a filename */
function getExtension(fileName: string): string {
  if (!fileName) return ''
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
}

export const ChatInput = () => {
  const theme = useMantineTheme()
  const [message, setMessage] = useState<string>('')
  const user = useContext(userContext)
  const userSelectedFriendId = useContext(userSelectedFriendIdContext)
  const [file, setFile] = useState<File | null>(null)

  /** Function to handle sending a message */
  const sendMessage = async () => {
    if (!message.trim() && !file) {
      return // Don't send empty messages
    }

    try {
      const messageRef = collection(db, 'messages')

      if (file) {
        const fileName = `${uuidv4()}.${getExtension(file.name)}`
        const storageRef = ref(storage, `uploads/${fileName}`)
        
        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file)
        const fileURL = await getDownloadURL(storageRef)

        // Send message with file metadata
        await addDoc(messageRef, {
          profileURL: user?.photoURL,
          content: message,
          timestamp: serverTimestamp(),
          imageURL: fileURL,
          fileType: getExtension(file.name),
          senderId: user?.uid,
          receiverId: userSelectedFriendId?.userSelectedFriendId,
        })
      } else {
        // Send text-only message
        await addDoc(messageRef, {
          profileURL: user?.photoURL,
          content: message,
          timestamp: serverTimestamp(),
          senderId: user?.uid,
          receiverId: userSelectedFriendId?.userSelectedFriendId,
        })
      }

      // Clear input and file after sending
      setMessage('')
      setFile(null)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <Box
      className="flex h-20 w-full items-center justify-center bg-white px-4"
      sx={{
        borderTop: `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      <form
        className="w-full flex items-center justify-center space-x-3"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
      >
        {/* File Attachment Button */}
        <FileButton onChange={setFile} accept="image/*">
          {(props) => (
            <ActionIcon
              size={'lg'}
              color={theme.primaryColor}
              {...props}
              variant="filled"
            >
              <IconPaperclip size="1.1rem" stroke={1.5} />
            </ActionIcon>
          )}
        </FileButton>

        {/* Message Input */}
        <TextInput
          radius="xl"
          className="w-full"
          size="md"
          value={message}
          rightSection={
            <ActionIcon
              size={32}
              radius="xl"
              type="submit"
              color={theme.primaryColor}
              variant="filled"
            >
              <IconArrowRight size="1.1rem" stroke={1.5} />
            </ActionIcon>
          }
          placeholder="Type your message..."
          rightSectionWidth={42}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
      </form>
    </Box>
  )
}
