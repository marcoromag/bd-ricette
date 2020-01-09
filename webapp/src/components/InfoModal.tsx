import * as React from 'react'

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

export const InfoModal : React.FC<{body?: string | React.ReactElement, titolo?: string, button?: string, onConfirm?: ()=>void}> = ({body, titolo, button, onConfirm}) => {
    return  <Modal isOpen={!!body} backdrop={true}>
    <ModalHeader >{titolo ? titolo: 'Informazione'}</ModalHeader>
    <ModalBody>
      {body}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={onConfirm}>{button || 'Ok'}</Button>
    </ModalFooter>
  </Modal>
}