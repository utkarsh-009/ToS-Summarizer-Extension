import torch

print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0))

def check_cuda():
    # Check if CUDA is available
    is_cuda_available = torch.cuda.is_available()
    print(f"CUDA available: {is_cuda_available}")

    if is_cuda_available:
        # Get the current CUDA device
        current_device = torch.cuda.current_device()
        print(f"Current CUDA device: {current_device}")

        # Get the name of the current CUDA device
        device_name = torch.cuda.get_device_name(current_device)
        print(f"CUDA device name: {device_name}")

if __name__ == "__main__":
    check_cuda()
