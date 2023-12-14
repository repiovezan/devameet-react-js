import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import avatarIcon from '../../assets/images/avatar.svg';

type AvatarInputProps = {
  image: string,
  alt?: string,
  setImage(s: string): void
}

export const AvatarInput : React.FC<AvatarInputProps> = ({image, setImage, alt}) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('');

  const avatars = [
    { value: "avatar_01" },
    { value: "avatar_02" },
    { value: "avatar_03" },
    { value: "avatar_04" },
    { value: "avatar_05" },
    { value: "avatar_06" },
    { value: "avatar_07" },
    { value: "avatar_08" },
    { value: "avatar_09" },
  ];

  function getAvatarUrl(avatar: string) {
    const path = `../../assets/objects/avatar/${avatar}_front.png`;
    const imgUrl = new URL(path, import.meta.url);
    return imgUrl.href;
  }

  const avatarImage = () => {
    if(image && image.trim().length > 0){
      const path = `../../assets/objects/avatar/${image}_front.png`;
    const imgUrl = new URL(path, import.meta.url);
    return imgUrl.href;
    }
    return avatarIcon;
  };

  const submitAvatar = () => {
    if(selected){
      setImage(selected);
      setShowModal(false);
    }
  }

  return (
    <>
      <div
        className="container-upload-image"
        onClick={() => setShowModal(true)}
      >
        <div className="avatar">
          <img src={avatarImage()} alt="avatar" />
        </div>
          <span>Alterar avatar</span>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="container-modal"
      >
        <Modal.Body>
          <div className="content">
            <p>Avatar</p>
            <span>Selecione seu avatar</span>
            <hr className="line" />
            <div className="avatars-scroll">
              <div className="avatars">
                {avatars.map((avatar: any) => (
                  <div className={"container-avatar " + (selected === avatar.value ? 'selected' : '')} key={avatar.value} onClick={() => setSelected(avatar.value)}>
                    <img src={getAvatarUrl(avatar.value)} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="actions">
              <span onClick={() => setShowModal(false)}>Voltar</span>
              <button onClick={submitAvatar}>Salvar</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
