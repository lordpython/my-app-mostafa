import os
import re
import argparse

def remove_line_numbers(file_path):
    """
    Removes leading line numbers in the format 'number|' from each line of the file.
    """
    pattern = re.compile(r'^\d+\|')
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    cleaned_lines = [pattern.sub('', line) for line in lines]

    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(cleaned_lines)

def process_directory(directory, file_extensions):
    """
    Processes all files in the given directory (and subdirectories) with the specified extensions.
    """
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in file_extensions):
                file_path = os.path.join(root, file)
                print(f"Processing: {file_path}")
                remove_line_numbers(file_path)

def main():
    parser = argparse.ArgumentParser(description="Remove leading line numbers from code files.")
    parser.add_argument(
        "path",
        type=str,
        help="Path to the file or directory to process."
    )
    parser.add_argument(
        "--extensions",
        type=str,
        nargs="*",
        default=[".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".css", ".html"],
        help="File extensions to include (e.g., .ts .js .py)."
    )

    args = parser.parse_args()

    if os.path.isfile(args.path):
        remove_line_numbers(args.path)
    elif os.path.isdir(args.path):
        process_directory(args.path, args.extensions)
    else:
        print("The provided path is neither a file nor a directory.")

if __name__ == "__main__":
    main()