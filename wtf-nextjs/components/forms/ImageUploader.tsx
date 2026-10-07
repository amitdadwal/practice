import React, { useState } from 'react';
import { Button, Typography, FormControl, FormHelperText } from '@mui/material';
import styled from '@emotion/styled';
import colors from 'styles/colors';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { fontSize } from 'styles/utils';
import type { IInputProps } from 'baseapp-nextjs-core'

interface IImageUploadInput extends IInputProps {
  multiple?: boolean
}

interface ImageFile {
  file: File;
  imagePreviewUrl: string | ArrayBuffer | null;
}

function ImageUploader({ name, formik, multiple = false, ...props }: IImageUploadInput) {
  const [images, setImages] = useState([] as ImageFile[]);
  const deleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    formik.setFieldValue(name, "");
  };

  const showError = (formik.errors?.[name] && formik.touched?.[name]) as boolean

  function onChange(e: any): void { //eslint-disable-line @typescript-eslint/no-explicit-any
    for (let i = 0; i < e.target?.files?.length; i++) {
      const file = e.target?.files[i];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (multiple) {
          // @todo: add multiple images on formik.handlechange
          setImages((prevImages) => [
            ...prevImages,
            { file: file, imagePreviewUrl: fileReader.result },
          ]);
        } else {
          setImages([{ file: file, imagePreviewUrl: fileReader.result }]);
          formik.handleChange({
            ...e,
            target: { ...e.target, name, value: fileReader.result },
          });
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  return (
    <FormControl error={showError} fullWidth>
      <UploaderButton
        component="label"
        htmlFor={'photosInput' + name}
        variant="outlined"
        color="primary"
        sx={{ display: images.length ? 'none' : 'auto' }}
      >
        <UploadFileOutlinedIcon sx={{ marginRight: 1 }} />
        Upload Photo
      </UploaderButton>
      <input
        name={name}
        id={'photosInput' + name}
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: 'none' }}
        {...props}
      />
      {showError && (
        <FormHelperText>
          {formik.errors?.[name]}
        </FormHelperText>
      )}
      {images.map((img, index) => (
        <ImageGroup key={index}>
          <Image src={img.imagePreviewUrl as string} alt="preview" />
          <LabelGroup>
            <ImageLabel variant="caption">{img.file.name}</ImageLabel>
            <DeleteButton
              onClick={() => deleteImage(index)}
              variant="text"
              color="primary"
            >
              Remove Photo
            </DeleteButton>
          </LabelGroup>
        </ImageGroup>
      ))}
    </FormControl>
  );
}

export default ImageUploader;

const UploaderButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  border: 1px dashed ${colors.gray[200]};
  border-radius: 8px;
  height: 46px;
  color: ${colors.gray[400]};
  text-transform: capitalize;
` as typeof Button;

const ImageGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const Image = styled.img`
  width: 87px;
  height: 87px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.spacing(1)};
`;

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const ImageLabel = styled(Typography)`
  color: ${colors.gray[700]};
  font-size: ${fontSize(16)};
  padding: ${({ theme }) => theme.spacing(1)};
`;

const DeleteButton = styled(Button)`
  color: ${colors.red[100]};
  text-decoration: underline;
  text-transform: capitalize;
  font-size: ${fontSize(14)};

  &:hover {
    color: ${colors.red[200]};
  }
`;
